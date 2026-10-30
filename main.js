(function () {
  'use strict';
  if (window.__YouSource) { window.__YouSource.open(); return; }

  ['ys-fab','ys-panel','ys-sug','ys-toasts','ys-watermark','yousource-style','ys-loader','yousource-tools-style','ys-ctx-menu','ys-top-banner'].forEach(id => {
    const el = document.getElementById(id); if (el) el.remove();
  });
  if (window.__ysObs) { try { window.__ysObs.disconnect(); } catch(e){} }
  if (window.__ysDotsObs) { try { window.__ysDotsObs.disconnect(); } catch(e){} }
  if (window.__ysPingTimer) clearInterval(window.__ysPingTimer);

  const SYMBOL_LOGO = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M21.58 7.19c-.23-1.25-1.25-2.23-2.49-2.46C16.89 4.25 12 4.25 12 4.25s-4.89 0-7.09.48C3.67 4.96 2.65 5.94 2.42 7.19 2 9.42 2 12 2 12s0 2.58.42 4.81c.23 1.25 1.25 2.23 2.49 2.46 2.2.48 7.09.48 7.09.48s4.89 0 7.09-.48c1.24-.23 2.26-1.21 2.49-2.46.42-2.23.42-4.81.42-4.81s0-2.58-.42-4.81zM9.99 15.41V8.59l5.73 3.41-5.73 3.41z'/%3E%3C/svg%3E";
  let ANIME_LOGO = SYMBOL_LOGO;
  let CURRENT_VERSION = '6.7.0';

  async function fetchAnimeLogo() {
    const apis = [
      async () => { const r = await fetch('https://api.waifu.pics/sfw/waifu'); const d = await r.json(); return d.url; },
      async () => { const r = await fetch('https://nekos.life/api/v2/img/waifu'); const d = await r.json(); return d.url; },
      async () => { const r = await fetch('https://api.waifu.im/search?included_tags=waifu'); const d = await r.json(); return d.images[0].url; }
    ];
    for (let api of apis) {
      try { const url = await api(); if (url) return url; } catch (e) { continue; }
    }
    return SYMBOL_LOGO;
  }

  const loader = document.createElement('div');
  loader.id = 'ys-loader';
  const loaderImg = document.createElement('img');
  loaderImg.src = SYMBOL_LOGO;
  const loaderText = document.createElement('div');
  loaderText.textContent = 'YouSource is waking up...';
  loader.appendChild(loaderImg);
  loader.appendChild(loaderText);
  document.documentElement.appendChild(loader);

  const remixLink = document.createElement('link');
  remixLink.rel = 'stylesheet';
  remixLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
  document.head.appendChild(remixLink);

  const TOOLS = [
    { id: 'hideShorts', label: 'Hide Shorts', selector: 'ytd-reel-item-renderer, ytd-reel-shelf-renderer', css: 'display:none!important' },
    { id: 'hideWatched', label: 'Hide Watched', selector: 'ytd-thumbnail-overlay-resume-playback-renderer', css: 'display:none!important' },
    { id: 'hideLive', label: 'Hide Live Streams', selector: 'ytd-badge-supported-renderer[aria-label="LIVE"]', css: 'display:none!important' },
    { id: 'hideMembers', label: 'Hide Members-Only', selector: 'ytd-badge-supported-renderer[aria-label*="Members"]', css: 'display:none!important' },
    { id: 'hideComments', label: 'Hide Comments', selector: 'ytd-comments, #comments', css: 'display:none!important' },
    { id: 'hideEndCards', label: 'Hide End Cards', selector: '.ytp-ce-element, .ytp-cards-teaser, .ytp-cards-button', css: 'display:none!important' },
    { id: 'hideSidebar', label: 'Hide Sidebar', selector: '#guide, ytd-mini-guide-renderer, #guide-button', css: 'display:none!important' },
    { id: 'hideMasthead', label: 'Hide Top Navbar', selector: '#masthead-container', css: 'display:none!important' },
    { id: 'hideHomeFeed', label: 'Hide Home Feed', selector: 'ytd-browse[page-subtype="home"]', css: 'display:none!important' },
    { id: 'hideSubscriptions', label: 'Hide Subscriptions', selector: 'ytd-browse[page-subtype="subscriptions"]', css: 'display:none!important' },
    { id: 'hideExplore', label: 'Hide Explore', selector: 'ytd-guide-entry-renderer[title="Explore"]', css: 'display:none!important' },
    { id: 'hideTrending', label: 'Hide Trending', selector: 'ytd-guide-entry-renderer[title="Trending"]', css: 'display:none!important' },
    { id: 'hideMusic', label: 'Hide Music', selector: 'ytd-guide-entry-renderer[title="Music"]', css: 'display:none!important' },
    { id: 'hideGaming', label: 'Hide Gaming', selector: 'ytd-guide-entry-renderer[title="Gaming"]', css: 'display:none!important' },
    { id: 'hideNews', label: 'Hide News', selector: 'ytd-guide-entry-renderer[title="News"]', css: 'display:none!important' },
    { id: 'hideSports', label: 'Hide Sports', selector: 'ytd-guide-entry-renderer[title="Sports"]', css: 'display:none!important' },
    { id: 'hideHistory', label: 'Hide History', selector: 'ytd-guide-entry-renderer[title="History"]', css: 'display:none!important' },
    { id: 'hidePlaylists', label: 'Hide Playlists', selector: 'ytd-guide-entry-renderer[title="Playlists"]', css: 'display:none!important' },
    { id: 'hideWatchLater', label: 'Hide Watch Later', selector: 'ytd-guide-entry-renderer[title="Watch Later"]', css: 'display:none!important' },
    { id: 'hideLiked', label: 'Hide Liked Videos', selector: 'ytd-guide-entry-renderer[title="Liked Videos"]', css: 'display:none!important' },
    { id: 'hideChat', label: 'Hide Live Chat', selector: '#chat, ytd-live-chat-frame', css: 'display:none!important' },
    { id: 'hideRecSidebar', label: 'Hide Sidebar Recs', selector: '#secondary', css: 'display:none!important' },
    { id: 'hideRecBelow', label: 'Hide Below Recs', selector: '#related', css: 'display:none!important' },
    { id: 'centerPlayer', label: 'Center Player', selector: 'ytd-watch-flexy #player-container-outer', css: 'margin:0 auto!important;max-width:1200px!important' },
    { id: 'expandPlayer', label: 'Expand Player', selector: 'ytd-watch-flexy #player-container-outer', css: 'max-width:100%!important;width:100%!important' },
    { id: 'forceDark', label: 'Force Dark Mode', selector: 'ytd-app', css: '--yt-spec-base-background:#0f0f0f!important;--yt-spec-text-primary:#f1f1f1!important' },
    { id: 'trueDark', label: 'True Dark (OLED)', selector: 'ytd-app', css: '--yt-spec-base-background:#000!important;--yt-spec-raised-background:#000!important' },
    { id: 'removeShortsShelf', label: 'Remove Shorts Shelf', selector: 'ytd-reel-shelf-renderer', css: 'display:none!important' },
    { id: 'removeCommunity', label: 'Remove Community Posts', selector: 'ytd-post-renderer', css: 'display:none!important' },
    { id: 'removeMixes', label: 'Remove Mixes', selector: 'ytd-radio-renderer', css: 'display:none!important' },
    { id: 'hideAutoplay', label: 'Hide Autoplay Button', selector: '.ytp-autonav-toggle-button-container', css: 'display:none!important' },
    { id: 'hideMiniplayer', label: 'Hide Miniplayer', selector: '.ytp-miniplayer-button', css: 'display:none!important' },
    { id: 'hideAmbient', label: 'Hide Ambient Mode', selector: '#cinematics', css: 'display:none!important' },
    { id: 'disableAutoplay', label: 'Disable Autoplay', selector: '.ytp-autonav-toggle-button', css: 'display:none!important' },
    { id: 'autoExpandDesc', label: 'Auto-Expand Description', selector: '#expand', css: 'display:none!important' },
    { id: 'autoExpandDesc2', label: 'Auto-Expand Description (Height)', selector: '#description', css: 'max-height:none!important' },
    { id: 'widePlayer', label: 'Wide Player', selector: 'ytd-watch-flexy[flexy] #player-container-outer', css: 'max-width:100%!important' },
    { id: 'hideChannelInfo', label: 'Hide Channel Info', selector: '#owner', css: 'display:none!important' },
    { id: 'hideVideoInfo', label: 'Hide Video Info', selector: '#info', css: 'display:none!important' },
    { id: 'hideActions', label: 'Hide Actions Bar', selector: '#top-row', css: 'display:none!important' },
    { id: 'hideVoiceSearch', label: 'Hide Voice Search', selector: '#voice-search-button', css: 'display:none!important' },
    { id: 'hideNotifications', label: 'Hide Notifications', selector: '#notification-button', css: 'display:none!important' },
    { id: 'hideCreate', label: 'Hide Create Button', selector: '#create-icon', css: 'display:none!important' },
    { id: 'hideAvatar', label: 'Hide User Avatar', selector: '#avatar-btn', css: 'display:none!important' },
    { id: 'hideLogo', label: 'Hide YT Logo', selector: '#logo-icon', css: 'display:none!important' },
    { id: 'hideSearchFilters', label: 'Hide Search Filters', selector: 'ytd-search-sub-menu-renderer', css: 'display:none!important' },
    { id: 'hideFooter', label: 'Hide Footer', selector: '#footer', css: 'display:none!important' },
    { id: 'hideAlerts', label: 'Hide Alerts', selector: 'ytd-alert-with-button-renderer', css: 'display:none!important' },
    { id: 'hidePromo', label: 'Hide Promo Banners', selector: 'ytd-statement-banner-renderer', css: 'display:none!important' },
    { id: 'hideVideoTitle', label: 'Hide Video Title', selector: '#title h1', css: 'display:none!important' },
    { id: 'hideVideoDesc', label: 'Hide Video Description', selector: '#description', css: 'display:none!important' },
    { id: 'hideSubscribe', label: 'Hide Subscribe Button', selector: '#subscribe-button', css: 'display:none!important' },
    { id: 'hideLike', label: 'Hide Like Button', selector: '#top-level-buttons-computed > ytd-toggle-button-renderer:first-child', css: 'display:none!important' },
    { id: 'hideDislike', label: 'Hide Dislike Button', selector: '#top-level-buttons-computed > ytd-toggle-button-renderer:last-child', css: 'display:none!important' },
    { id: 'hideShare', label: 'Hide Share Button', selector: '#share-button', css: 'display:none!important' },
    { id: 'hideSave', label: 'Hide Save Button', selector: '#save-button', css: 'display:none!important' },
    { id: 'hideDownload', label: 'Hide Download Button', selector: '#download-button', css: 'display:none!important' },
    { id: 'hideTranscript', label: 'Hide Transcript', selector: '#transcript', css: 'display:none!important' },
    { id: 'hideChapters', label: 'Hide Chapters', selector: '#chapters', css: 'display:none!important' },
    { id: 'hideInfoCards', label: 'Hide Info Cards', selector: '.ytp-cards-button', css: 'display:none!important' },
    { id: 'hideEndScreens', label: 'Hide End Screens', selector: '.ytp-ce-element', css: 'display:none!important' },
    { id: 'hideAnnotations', label: 'Hide Annotations', selector: '.annotation', css: 'display:none!important' },
    { id: 'hideCaptions', label: 'Hide Captions', selector: '.ytp-caption-window-container', css: 'display:none!important' },
    { id: 'hideSettings', label: 'Hide Settings', selector: '.ytp-settings-button', css: 'display:none!important' },
    { id: 'hideQuality', label: 'Hide Quality', selector: '.ytp-quality-button', css: 'display:none!important' },
    { id: 'hideSpeed', label: 'Hide Speed', selector: '.ytp-playback-rate-button', css: 'display:none!important' },
    { id: 'hideTheater', label: 'Hide Theater', selector: '.ytp-size-button', css: 'display:none!important' },
    { id: 'hideFullscreen', label: 'Hide Fullscreen', selector: '.ytp-fullscreen-button', css: 'display:none!important' },
    { id: 'hideVolume', label: 'Hide Volume', selector: '.ytp-volume-area', css: 'display:none!important' },
    { id: 'hideProgress', label: 'Hide Progress Bar', selector: '.ytp-progress-bar-container', css: 'display:none!important' },
    { id: 'hideTimeline', label: 'Hide Timeline', selector: '.ytp-timeline', css: 'display:none!important' },
    { id: 'hidePlaylist', label: 'Hide Playlist', selector: 'ytd-playlist-panel-renderer', css: 'display:none!important' },
    { id: 'hideQueue', label: 'Hide Queue', selector: 'ytd-playlist-panel-renderer', css: 'display:none!important' },
    { id: 'hideHistorySidebar', label: 'Hide History Sidebar', selector: 'ytd-guide-entry-renderer[title="History"]', css: 'display:none!important' },
    { id: 'hideSubsSidebar', label: 'Hide Subscriptions Sidebar', selector: 'ytd-guide-entry-renderer[title="Subscriptions"]', css: 'display:none!important' },
    { id: 'hideTrendingSidebar', label: 'Hide Trending Sidebar', selector: 'ytd-guide-entry-renderer[title="Trending"]', css: 'display:none!important' },
    { id: 'hideExploreSidebar', label: 'Hide Explore Sidebar', selector: 'ytd-guide-entry-renderer[title="Explore"]', css: 'display:none!important' },
    { id: 'hideMusicSidebar', label: 'Hide Music Sidebar', selector: 'ytd-guide-entry-renderer[title="Music"]', css: 'display:none!important' },
    { id: 'hideGamingSidebar', label: 'Hide Gaming Sidebar', selector: 'ytd-guide-entry-renderer[title="Gaming"]', css: 'display:none!important' },
    { id: 'hideNewsSidebar', label: 'Hide News Sidebar', selector: 'ytd-guide-entry-renderer[title="News"]', css: 'display:none!important' },
    { id: 'hideSportsSidebar', label: 'Hide Sports Sidebar', selector: 'ytd-guide-entry-renderer[title="Sports"]', css: 'display:none!important' },
    { id: 'hideLiveSidebar', label: 'Hide Live Sidebar', selector: 'ytd-guide-entry-renderer[title="Live"]', css: 'display:none!important' },
    { id: 'hideMoviesSidebar', label: 'Hide Movies Sidebar', selector: 'ytd-guide-entry-renderer[title="Movies"]', css: 'display:none!important' },
    { id: 'hideShowsSidebar', label: 'Hide Shows Sidebar', selector: 'ytd-guide-entry-renderer[title="Shows"]', css: 'display:none!important' },
    { id: 'hidePodcastsSidebar', label: 'Hide Podcasts Sidebar', selector: 'ytd-guide-entry-renderer[title="Podcasts"]', css: 'display:none!important' },
    { id: 'hideCoursesSidebar', label: 'Hide Courses Sidebar', selector: 'ytd-guide-entry-renderer[title="Courses"]', css: 'display:none!important' },
    { id: 'hideReportsSidebar', label: 'Hide Reports Sidebar', selector: 'ytd-guide-entry-renderer[title="Reports"]', css: 'display:none!important' },
    { id: 'hideLibrarySidebar', label: 'Hide Library Sidebar', selector: 'ytd-guide-entry-renderer[title="Library"]', css: 'display:none!important' },
    { id: 'hideLikesSidebar', label: 'Hide Likes Sidebar', selector: 'ytd-guide-entry-renderer[title="Likes"]', css: 'display:none!important' },
    { id: 'hideWatchLaterSidebar', label: 'Hide Watch Later Sidebar', selector: 'ytd-guide-entry-renderer[title="Watch Later"]', css: 'display:none!important' },
    { id: 'hideYourVideosSidebar', label: 'Hide Your Videos Sidebar', selector: 'ytd-guide-entry-renderer[title="Your Videos"]', css: 'display:none!important' },
    { id: 'hideDownloadsSidebar', label: 'Hide Downloads Sidebar', selector: 'ytd-guide-entry-renderer[title="Downloads"]', css: 'display:none!important' },
    { id: 'hideClipsSidebar', label: 'Hide Clips Sidebar', selector: 'ytd-guide-entry-renderer[title="Clips"]', css: 'display:none!important' },
    { id: 'hidePlaylistsSidebar2', label: 'Hide Playlists Sidebar', selector: 'ytd-guide-entry-renderer[title="Playlists"]', css: 'display:none!important' },
    { id: 'hideMixesSidebar', label: 'Hide Mixes Sidebar', selector: 'ytd-guide-entry-renderer[title="Mixes"]', css: 'display:none!important' },
    { id: 'hideRadiosSidebar', label: 'Hide Radios Sidebar', selector: 'ytd-guide-entry-renderer[title="Radios"]', css: 'display:none!important' },
    { id: 'hideCommunitySidebar', label: 'Hide Community Sidebar', selector: 'ytd-guide-entry-renderer[title="Community"]', css: 'display:none!important' },
    { id: 'hidePostsSidebar', label: 'Hide Posts Sidebar', selector: 'ytd-guide-entry-renderer[title="Posts"]', css: 'display:none!important' },
    { id: 'hideCommentsSidebar', label: 'Hide Comments Sidebar', selector: 'ytd-guide-entry-renderer[title="Comments"]', css: 'display:none!important' },
    { id: 'hideRepliesSidebar', label: 'Hide Replies Sidebar', selector: 'ytd-guide-entry-renderer[title="Replies"]', css: 'display:none!important' },
    { id: 'hideMentionsSidebar', label: 'Hide Mentions Sidebar', selector: 'ytd-guide-entry-renderer[title="Mentions"]', css: 'display:none!important' },
    { id: 'hideReactionsSidebar', label: 'Hide Reactions Sidebar', selector: 'ytd-guide-entry-renderer[title="Reactions"]', css: 'display:none!important' },
    { id: 'hideSharesSidebar', label: 'Hide Shares Sidebar', selector: 'ytd-guide-entry-renderer[title="Shares"]', css: 'display:none!important' },
    { id: 'hideTagsSidebar', label: 'Hide Tags Sidebar', selector: 'ytd-guide-entry-renderer[title="Tags"]', css: 'display:none!important' },
    { id: 'hideHashtagsSidebar', label: 'Hide Hashtags Sidebar', selector: 'ytd-guide-entry-renderer[title="Hashtags"]', css: 'display:none!important' },
    { id: 'hideLinksSidebar', label: 'Hide Links Sidebar', selector: 'ytd-guide-entry-renderer[title="Links"]', css: 'display:none!important' },
    { id: 'hideTimestampsSidebar', label: 'Hide Timestamps Sidebar', selector: 'ytd-guide-entry-renderer[title="Timestamps"]', css: 'display:none!important' },
    { id: 'hideCardsSidebar', label: 'Hide Cards Sidebar', selector: 'ytd-guide-entry-renderer[title="Cards"]', css: 'display:none!important' },
    { id: 'hideOverlaysSidebar', label: 'Hide Overlays Sidebar', selector: 'ytd-guide-entry-renderer[title="Overlays"]', css: 'display:none!important' },
    { id: 'hideWatermarksSidebar', label: 'Hide Watermarks Sidebar', selector: 'ytd-guide-entry-renderer[title="Watermarks"]', css: 'display:none!important' },
    { id: 'hideBrandingSidebar', label: 'Hide Branding Sidebar', selector: 'ytd-guide-entry-renderer[title="Branding"]', css: 'display:none!important' },
    { id: 'hideMerchSidebar', label: 'Hide Merch Sidebar', selector: 'ytd-guide-entry-renderer[title="Merch"]', css: 'display:none!important' },
    { id: 'hideSponsorsSidebar', label: 'Hide Sponsors Sidebar', selector: 'ytd-guide-entry-renderer[title="Sponsors"]', css: 'display:none!important' },
    { id: 'hideJoinSidebar', label: 'Hide Join Sidebar', selector: 'ytd-guide-entry-renderer[title="Join"]', css: 'display:none!important' },
    { id: 'hideMembershipSidebar', label: 'Hide Membership Sidebar', selector: 'ytd-guide-entry-renderer[title="Membership"]', css: 'display:none!important' },
    { id: 'hideSuperchatSidebar', label: 'Hide Superchat Sidebar', selector: 'ytd-guide-entry-renderer[title="Superchat"]', css: 'display:none!important' },
    { id: 'hideDonationsSidebar', label: 'Hide Donations Sidebar', selector: 'ytd-guide-entry-renderer[title="Donations"]', css: 'display:none!important' },
    { id: 'hideLiveChatSidebar', label: 'Hide Live Chat Sidebar', selector: 'ytd-guide-entry-renderer[title="Live Chat"]', css: 'display:none!important' },
    { id: 'hideTopChatSidebar', label: 'Hide Top Chat Sidebar', selector: 'ytd-guide-entry-renderer[title="Top Chat"]', css: 'display:none!important' },
    { id: 'hideModerationSidebar', label: 'Hide Moderation Sidebar', selector: 'ytd-guide-entry-renderer[title="Moderation"]', css: 'display:none!important' },
    { id: 'hideFiltersSidebar', label: 'Hide Filters Sidebar', selector: 'ytd-guide-entry-renderer[title="Filters"]', css: 'display:none!important' },
    { id: 'hideSortingSidebar', label: 'Hide Sorting Sidebar', selector: 'ytd-guide-entry-renderer[title="Sorting"]', css: 'display:none!important' },
    { id: 'hideSearchBarSidebar', label: 'Hide Search Bar Sidebar', selector: 'ytd-guide-entry-renderer[title="Search Bar"]', css: 'display:none!important' },
    { id: 'hideSuggestionsSidebar', label: 'Hide Suggestions Sidebar', selector: 'ytd-guide-entry-renderer[title="Suggestions"]', css: 'display:none!important' },
    { id: 'hideAutocompleteSidebar', label: 'Hide Autocomplete Sidebar', selector: 'ytd-guide-entry-renderer[title="Autocomplete"]', css: 'display:none!important' },
    { id: 'hideVoiceSearchSidebar', label: 'Hide Voice Search Sidebar', selector: 'ytd-guide-entry-renderer[title="Voice Search"]', css: 'display:none!important' },
    { id: 'hideVisualSearchSidebar', label: 'Hide Visual Search Sidebar', selector: 'ytd-guide-entry-renderer[title="Visual Search"]', css: 'display:none!important' },
    { id: 'hideFiltersSidebar2', label: 'Hide Filters Sidebar (Advanced)', selector: 'ytd-guide-entry-renderer[title="Filters"]', css: 'display:none!important' },
    { id: 'hideDurationSidebar', label: 'Hide Duration Sidebar', selector: 'ytd-guide-entry-renderer[title="Duration"]', css: 'display:none!important' },
    { id: 'hideUploadDateSidebar', label: 'Hide Upload Date Sidebar', selector: 'ytd-guide-entry-renderer[title="Upload Date"]', css: 'display:none!important' },
    { id: 'hideTypeSidebar', label: 'Hide Type Sidebar', selector: 'ytd-guide-entry-renderer[title="Type"]', css: 'display:none!important' },
    { id: 'hideFeaturesSidebar', label: 'Hide Features Sidebar', selector: 'ytd-guide-entry-renderer[title="Features"]', css: 'display:none!important' },
    { id: 'hideSortBySidebar', label: 'Hide Sort By Sidebar', selector: 'ytd-guide-entry-renderer[title="Sort By"]', css: 'display:none!important' },
    { id: 'hideVideoSidebar', label: 'Hide Video Sidebar', selector: 'ytd-guide-entry-renderer[title="Video"]', css: 'display:none!important' },
    { id: 'hideAudioSidebar', label: 'Hide Audio Sidebar', selector: 'ytd-guide-entry-renderer[title="Audio"]', css: 'display:none!important' },
    { id: 'hideTextSidebar', label: 'Hide Text Sidebar', selector: 'ytd-guide-entry-renderer[title="Text"]', css: 'display:none!important' },
    { id: 'hideBackgroundSidebar', label: 'Hide Background Sidebar', selector: 'ytd-guide-entry-renderer[title="Background"]', css: 'display:none!important' },
    { id: 'hideButtonsSidebar', label: 'Hide Buttons Sidebar', selector: 'ytd-guide-entry-renderer[title="Buttons"]', css: 'display:none!important' },
    { id: 'hideIconsSidebar', label: 'Hide Icons Sidebar', selector: 'ytd-guide-entry-renderer[title="Icons"]', css: 'display:none!important' },
    { id: 'hideLinksSidebar2', label: 'Hide Links Sidebar (Advanced)', selector: 'ytd-guide-entry-renderer[title="Links"]', css: 'display:none!important' },
    { id: 'hideImagesSidebar', label: 'Hide Images Sidebar', selector: 'ytd-guide-entry-renderer[title="Images"]', css: 'display:none!important' },
    { id: 'hideThumbnailsSidebar', label: 'Hide Thumbnails Sidebar', selector: 'ytd-guide-entry-renderer[title="Thumbnails"]', css: 'display:none!important' },
    { id: 'hideProgressSidebar', label: 'Hide Progress Sidebar', selector: 'ytd-guide-entry-renderer[title="Progress"]', css: 'display:none!important' },
    { id: 'hideSliderSidebar', label: 'Hide Slider Sidebar', selector: 'ytd-guide-entry-renderer[title="Slider"]', css: 'display:none!important' },
    { id: 'hideTooltipSidebar', label: 'Hide Tooltip Sidebar', selector: 'ytd-guide-entry-renderer[title="Tooltip"]', css: 'display:none!important' },
    { id: 'hideDropdownSidebar', label: 'Hide Dropdown Sidebar', selector: 'ytd-guide-entry-renderer[title="Dropdown"]', css: 'display:none!important' },
    { id: 'hideModalSidebar', label: 'Hide Modal Sidebar', selector: 'ytd-guide-entry-renderer[title="Modal"]', css: 'display:none!important' },
    { id: 'hidePopupSidebar', label: 'Hide Popup Sidebar', selector: 'ytd-guide-entry-renderer[title="Popup"]', css: 'display:none!important' },
    { id: 'hideOverlaySidebar', label: 'Hide Overlay Sidebar', selector: 'ytd-guide-entry-renderer[title="Overlay"]', css: 'display:none!important' }
  ];

  const DEF = {
    on: true, logoType: 'anime',
    region: '', strictRegion: false,
    suggest: true, minimal: true,
    serverBindEnabled: false, bridgeUrl: '',
    autoUpdate: true
  };
  TOOLS.forEach(t => DEF[t.id] = false);

  let S;
  try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem('ys.v6.7') || '{}')); }
  catch (e) { S = Object.assign({}, DEF); }
  
  if (!S.removedVideos) S.removedVideos = [];

  const save = () => { try { localStorage.setItem('ys.v6.7', JSON.stringify(S)); } catch(e){} };

  const BASE_CSS = `
  #ys-loader{position:fixed!important;inset:0!important;z-index:2147483647!important;background:#0a0a0c!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;transition:opacity .6s ease, visibility .6s!important}
  #ys-loader img{width:100px!important;height:100px!important;border-radius:50%!important;animation:pulse 2s infinite ease-in-out!important;box-shadow:0 0 40px rgba(75,122,99,0.4)!important;object-fit:cover!important;background:#17181a;border:2px solid #4b7a63}
  #ys-loader div{margin-top:20px!important;color:#7b8087!important;font:14px ui-sans-serif,system-ui!important;letter-spacing:0.1em!important;text-transform:uppercase!important}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:0.8}50%{transform:scale(1.05);opacity:1}}
  #ys-loader.ys-hide{opacity:0!important;visibility:hidden!important;pointer-events:none!important}

  #ys-fab{position:fixed!important;right:20px!important;bottom:20px!important;z-index:2147483647!important;
    width:48px!important;height:48px!important;border-radius:50%!important;background:rgba(20,21,23,0.85)!important;
    border:1px solid rgba(255,255,255,0.1)!important;display:grid!important;place-items:center!important;
    cursor:pointer!important;box-shadow:0 8px 32px rgba(0,0,0,0.5)!important;user-select:none!important;
    transition:all .2s ease!important;padding:0!important;backdrop-filter:blur(10px)!important;overflow:hidden!important}
  #ys-fab:hover{transform:scale(1.05)!important;background:rgba(30,32,35,0.95)!important}
  #ys-fab img{width:32px!important;height:32px!important;object-fit:cover!important;border-radius:50%!important}
  #ys-fab.ys-off{opacity:.5!important;filter:grayscale(1)!important}

  #ys-panel{position:fixed!important;right:20px!important;bottom:84px!important;z-index:2147483647!important;
    width:400px!important;max-height:85vh!important;overflow-y:auto!important;background:rgba(20,21,23,0.95)!important;
    color:#e8e8e8!important;border:1px solid rgba(255,255,255,0.1)!important;border-radius:20px!important;padding:18px!important;
    font:13px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;
    box-shadow:0 24px 64px rgba(0,0,0,0.7)!important;backdrop-filter:blur(16px)!important;
    box-sizing:border-box!important;display:none;flex-direction:column!important}
  #ys-panel::-webkit-scrollbar{width:6px}
  #ys-panel::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:6px}
  #ys-panel *{box-sizing:border-box}
  
  .ys-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .ys-brand{font-weight:700;letter-spacing:-0.02em;font-size:16px;display:flex;align-items:center;gap:8px}
  .ys-brand img{width:24px!important;height:24px!important;border-radius:50%!important;object-fit:cover!important;background:#17181a}
  .ys-brand span{color:#7b8087;font-weight:500;font-size:11px;margin-left:4px;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:6px}
  .ys-x{background:rgba(255,255,255,0.05);border:0;color:#a0a4a8;font-size:14px;cursor:pointer;padding:6px 10px;border-radius:8px;font-family:inherit;transition:.2s}
  .ys-x:hover{color:#fff;background:rgba(255,255,255,0.1)}

  .ys-tabs{display:flex;gap:6px;margin-bottom:14px;background:rgba(255,255,255,0.03);padding:4px;border-radius:10px}
  .ys-tab{flex:1;text-align:center;padding:8px;border-radius:8px;cursor:pointer;color:#7b8087;font-weight:600;font-size:12px;transition:.2s;border:none;background:none}
  .ys-tab:hover{color:#e8e8e8;background:rgba(255,255,255,0.05)}
  .ys-tab.active{background:rgba(255,255,255,0.1);color:#fff}
  .ys-content{display:none;flex-direction:column;gap:8px}
  .ys-content.active{display:flex}

  .ys-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;cursor:pointer;user-select:none}
  .ys-row>span{color:#c9ccd1;font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px}
  .ys-sep{height:1px;background:rgba(255,255,255,0.08);margin:10px 0}
  .ys-label{color:#7b8087;font-size:11px;text-transform:uppercase;letter-spacing:.08em;margin:12px 0 6px;font-weight:600}
  
  .ys-sw{-webkit-appearance:none;appearance:none;width:40px;height:22px;border-radius:22px;background:rgba(255,255,255,0.1);
    position:relative;cursor:pointer;transition:.25s;flex:0 0 auto;outline:none;border:0;padding:0;margin:0}
  .ys-sw:checked{background:#4b7a63}
  .ys-sw::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;
    background:#fff;transition:transform .25s cubic-bezier(0.4, 0, 0.2, 1);box-shadow:0 2px 4px rgba(0,0,0,0.2)}
  .ys-sw:checked::after{transform:translateX(18px)}
  
  .ys-sel,.ys-num,.ys-ta,.ys-ken input,.ys-input{background:rgba(255,255,255,0.05);color:#fff;border:1px solid rgba(255,255,255,0.1);
    border-radius:10px;padding:8px 10px;font:inherit;outline:none;transition:.2s;width:100%}
  .ys-sel:focus,.ys-num:focus,.ys-ta:focus,.ys-ken input:focus,.ys-input:focus{border-color:#4b7a63;background:rgba(255,255,255,0.08)}
  .ys-sel option{background:#141517}
  
  .ys-ken{display:flex!important;gap:8px!important;margin-bottom:4px!important}
  .ys-ken button,.ys-btn{background:#4b7a63!important;color:#fff!important;border:0!important;border-radius:10px!important;
    padding:8px 16px!important;font:inherit!important;font-weight:600!important;cursor:pointer!important;transition:.2s;display:flex;align-items:center;gap:6px;justify-content:center;width:100%}
  .ys-ken button:hover,.ys-btn:hover{background:#5a8f75!important}

  .ys-hint{color:#7b8087!important;font-size:11px!important;line-height:1.5!important;padding:2px 0 8px!important}
  .ys-hint b{color:#c9ccd1!important;font-weight:600!important}
  .ys-hint a{color:#6b9b84!important;text-decoration:none!important;cursor:pointer!important}
  .ys-hint a:hover{text-decoration:underline!important}
  .ys-hint code{background:rgba(255,255,255,0.1);padding:2px 4px;border-radius:4px;font-family:monospace;font-size:12px}
  
  .ys-foot{display:flex;align-items:center;justify-content:space-between;margin-top:16px}
  .ys-stat{color:#7b8087;font-size:11px;font-weight:500}
  .ys-reset{background:rgba(255,255,255,0.05);color:#c9ccd1;border:1px solid rgba(255,255,255,0.1);border-radius:10px;
    padding:6px 12px;font:inherit;font-size:12px;cursor:pointer;transition:.2s}
  .ys-reset:hover{background:rgba(255,255,255,0.1)}

  .ys-tool-search{margin-bottom:10px;display:flex;gap:8px}
  .ys-tool-list{display:flex;flex-direction:column;gap:2px;max-height:400px;overflow-y:auto;padding-right:4px}
  .ys-tool-list::-webkit-scrollbar{width:4px}
  .ys-tool-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:4px}
  .ys-more-btn{background:rgba(255,255,255,0.1)!important;margin-top:10px;padding:6px!important;font-size:12px!important}

  .ys-status-box{display:flex;align-items:center;gap:8px;padding:10px;background:rgba(0,0,0,0.2);border-radius:10px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.05)}
  .ys-status-dot{width:10px;height:10px;border-radius:50%;background:#8a3b3b;transition:.3s}
  .ys-status-dot.connected{background:#4b7a63;box-shadow:0 0 10px #4b7a63}
  .ys-status-dot.connecting{background:#8a6d2f;animation:blink 1s infinite}
  @keyframes blink{50%{opacity:0.5}}
  .ys-status-text{font-size:12px;font-weight:600;color:#e8e8e8}

  #ys-sug{position:fixed!important;z-index:2147483647!important;background:rgba(20,21,23,0.95)!important;
    border:1px solid rgba(255,255,255,0.1)!important;border-radius:12px!important;overflow:hidden!important;
    box-shadow:0 18px 44px rgba(0,0,0,0.7)!important;max-height:320px!important;overflow-y:auto!important;
    font:14px/1.3 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;
    box-sizing:border-box!important;backdrop-filter:blur(10px)!important}
  .ys-sug-item{display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer;color:#e8e8e8;white-space:nowrap;overflow:hidden;transition:.15s}
  .ys-sug-item:hover,.ys-sug-item.ys-sel{background:rgba(255,255,255,0.08)}
  .ys-sug-k{flex:0 0 auto;color:#7b8087;font-size:10px;letter-spacing:.08em;font-weight:700}
  .ys-sug-t{overflow:hidden;text-overflow:ellipsis}

  #ys-toasts{position:fixed!important;left:20px!important;bottom:20px!important;z-index:2147483647!important;
    display:flex!important;flex-direction:column!important;gap:10px!important;pointer-events:none!important;max-width:360px!important;
    font:13px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important}
  .ys-toast{display:flex!important;align-items:flex-start!important;gap:12px!important;background:rgba(20,21,23,0.95)!important;
    color:#e8e8e8!important;border:1px solid rgba(255,255,255,0.1)!important;border-radius:12px!important;padding:12px 16px!important;
    box-shadow:0 12px 32px rgba(0,0,0,0.6)!important;opacity:0!important;transform:translateY(12px)!important;backdrop-filter:blur(10px)!important;
    transition:all .3s cubic-bezier(0.4, 0, 0.2, 1)!important;pointer-events:auto!important}
  .ys-toast.ys-show{opacity:1!important;transform:none!important}
  .ys-toast-icon{flex:0 0 auto!important;width:22px!important;height:22px!important;border-radius:50%!important;display:grid!important;place-items:center!important;font-weight:700!important;font-size:11px!important;background:rgba(255,255,255,0.1)!important;color:#c9ccd1!important;margin-top:1px!important}
  .ys-toast-success .ys-toast-icon{background:#4b7a63!important;color:#fff!important}
  .ys-toast-warn .ys-toast-icon{background:#8a6d2f!important;color:#fff!important}
  .ys-toast-error .ys-toast-icon{background:#8a3b3b!important;color:#fff!important}
  .ys-toast-msg{flex:1!important;word-break:break-word!important}

  #ys-watermark{position:fixed!important;bottom:20px!important;right:20px!important;z-index:2147483646!important;pointer-events:none!important;opacity:0.6!important;transition:.3s!important}
  #ys-watermark img{width:36px!important;height:36px!important;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.5))!important;border-radius:50%!important;background:#17181a;object-fit:cover}

  #ys-ctx-menu{position:fixed!important;z-index:2147483647!important;background:rgba(20,21,23,0.95)!important;
    border:1px solid rgba(255,255,255,0.1)!important;border-radius:10px!important;padding:6px!important;
    box-shadow:0 10px 30px rgba(0,0,0,0.7)!important;backdrop-filter:blur(16px)!important;display:none;flex-direction:column!important;min-width:200px!important}
  .ys-ctx-item{color:#e8e8e8!important;padding:8px 12px!important;font:13px ui-sans-serif,system-ui!important;
    cursor:pointer!important;border-radius:6px!important;transition:background .15s!important;display:flex!important;align-items:center!important;gap:8px!important}
  .ys-ctx-item:hover{background:rgba(255,255,255,0.1)!important}

  .ys-3dots { position: absolute !important; top: 8px !important; right: 8px !important; z-index: 1000 !important; background: rgba(0,0,0,0.7) !important; color: white !important; border-radius: 6px !important; padding: 4px 8px !important; cursor: pointer !important; opacity: 0 !important; transition: opacity 0.2s !important; font-size: 18px !important; line-height: 1 !important; display: flex !important; align-items: center !important; justify-content: center !important; user-select: none !important; font-weight: bold; pointer-events: auto !important; }
  ytd-rich-item-renderer:hover .ys-3dots, ytd-video-renderer:hover .ys-3dots, ytd-compact-video-renderer:hover .ys-3dots, ytd-reel-item-renderer:hover .ys-3dots { opacity: 1 !important; }

  .ys-3dots-player { position: absolute !important; top: 16px !important; right: 16px !important; z-index: 9999 !important; background: rgba(0,0,0,0.6) !important; color: white !important; border-radius: 8px !important; width: 36px !important; height: 36px !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; font-size: 20px !important; transition: background 0.2s !important; pointer-events: auto !important; opacity: 0.8 !important; }
  .ys-3dots-player:hover { background: rgba(0,0,0,0.9) !important; opacity: 1 !important; }
  `;

  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(BASE_CSS);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch (e) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'yousource-style';
    styleSheet.textContent = BASE_CSS;
    document.head.appendChild(styleSheet);
  }

  const toolStyleSheet = document.createElement('style');
  toolStyleSheet.id = 'yousource-tools-style';
  document.head.appendChild(toolStyleSheet);

  function updateToolCSS() {
    let css = '';
    TOOLS.forEach(t => {
      if (S[t.id]) {
        css += `html.ys-on ${t.selector} { ${t.css} }\n`;
      }
    });
    toolStyleSheet.textContent = css;
  }

  let toastBox = null;
  function toast(msg, type, ms) {
    type = type || 'info';
    if (!toastBox) {
      toastBox = document.createElement('div'); toastBox.id = 'ys-toasts'; document.body.appendChild(toastBox);
    }
    const t = document.createElement('div'); t.className = 'ys-toast ys-toast-' + type;
    const ic = document.createElement('span'); ic.className = 'ys-toast-icon';
    ic.textContent = type === 'success' ? '✓' : type === 'warn' ? '!' : type === 'error' ? '×' : 'i';
    const m = document.createElement('span'); m.className = 'ys-toast-msg'; m.textContent = msg;
    t.appendChild(ic); t.appendChild(m); toastBox.appendChild(t);
    requestAnimationFrame(() => t.classList.add('ys-show'));
    setTimeout(() => { t.classList.remove('ys-show'); setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 350); }, ms || 3500);
    while (toastBox.children.length > 4) toastBox.removeChild(toastBox.firstChild);
  }

  let wm;
  function updateWatermark() {
    if (!wm) { wm = document.createElement('div'); wm.id = 'ys-watermark'; document.body.appendChild(wm); }
    while (wm.firstChild) wm.removeChild(wm.firstChild);
    if (S.on) {
      const img = document.createElement('img'); img.src = S.logoType === 'anime' ? ANIME_LOGO : SYMBOL_LOGO;
      wm.appendChild(img); wm.style.display = 'block';
    } else { wm.style.display = 'none'; }
  }

  let pingStatus = 'disconnected';
  
  function updateServerStatusUI() {
    const dot = document.getElementById('ys-status-dot');
    const txt = document.getElementById('ys-status-text');
    if (!dot || !txt) return;
    
    dot.className = 'ys-status-dot ' + pingStatus;
    if (pingStatus === 'connected') txt.textContent = 'Connected - NO SPY';
    else if (pingStatus === 'connecting') txt.textContent = 'Connecting...';
    else txt.textContent = 'Disconnected (Using YouTube Server)';
  }

  function startPing() {
    if (window.__ysPingTimer) clearInterval(window.__ysPingTimer);
    if (!S.serverBindEnabled || !S.bridgeUrl) {
      pingStatus = 'disconnected';
      updateServerStatusUI();
      return;
    }
    
    pingStatus = 'connecting';
    updateServerStatusUI();
    
    window.__ysPingTimer = setInterval(async () => {
      if (!S.serverBindEnabled || !S.bridgeUrl) {
        clearInterval(window.__ysPingTimer);
        return;
      }
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 2500);
        const r = await fetch(S.bridgeUrl.replace(/\/$/, '') + '/ping', { signal: ctrl.signal, mode: 'cors' });
        clearTimeout(tid);
        if (r.ok) {
          if (pingStatus !== 'connected') {
            pingStatus = 'connected';
            updateServerStatusUI();
            toast('Server Bridge Connected. Requests routed to local server.', 'success', 3000);
          }
        } else { throw new Error(); }
      } catch (e) {
        if (pingStatus === 'connected') {
          pingStatus = 'disconnected';
          updateServerStatusUI();
          toast('Server Bridge is closed reloading to youtube server.', 'error', 6000);
          S.serverBindEnabled = false;
          save();
          const sw = document.querySelector('[data-k="serverBindEnabled"]');
          if (sw) sw.checked = false;
        } else {
          pingStatus = 'disconnected';
          updateServerStatusUI();
        }
      }
    }, 4000);
  }

  async function ysFetch(url, options) {
    if (S.serverBindEnabled && S.bridgeUrl && pingStatus === 'connected') {
      try {
        const proxyUrl = S.bridgeUrl.replace(/\/$/, '') + '/proxy?url=' + encodeURIComponent(url);
        return await fetch(proxyUrl, options);
      } catch (e) {
        return fetch(url, options);
      }
    }
    return fetch(url, options);
  }

  async function checkForUpdates() {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 5000);
      const r = await fetch('https://raw.githubusercontent.com/G4mg1/YouSource/main/ver.txt', { signal: ctrl.signal });
      clearTimeout(tid);
      if (!r.ok) throw new Error('ver.txt fetch failed');
      const remoteVersion = (await r.text()).trim();
      
      if (remoteVersion && remoteVersion !== CURRENT_VERSION) {
        toast('Update found: v' + remoteVersion + '. Downloading...', 'info', 3000);
        const scriptR = await fetch('https://raw.githubusercontent.com/G4mg1/YouSource/main/main.js');
        if (!scriptR.ok) throw new Error('main.js fetch failed');
        const scriptText = await scriptR.text();
        
        let evaluated = false;
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
          try {
            const policy = window.trustedTypes.createPolicy('ys-update', { createScript: (s) => s });
            eval(policy.createScript(scriptText));
            evaluated = true;
          } catch (e) { console.warn("Trusted Types policy failed", e); }
        }
        if (!evaluated) {
          try {
            const blob = new Blob([scriptText], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            await import(url);
            URL.revokeObjectURL(url);
            evaluated = true;
          } catch (e) { console.warn("Blob import failed", e); }
        }
        if (!evaluated) {
          toast('CSP blocked update. Please reload manually.', 'error', 5000);
        } else {
          toast('Updated to v' + remoteVersion + '. Reload to apply.', 'success', 5000);
        }
      } else {
        toast('YouSource is up to date (v' + CURRENT_VERSION + ')', 'success', 3000);
      }
    } catch (e) {
      toast('Update check failed: ' + e.message, 'error', 5000);
    }
  }

  function makeSwitch(k) { const i = document.createElement('input'); i.type = 'checkbox'; i.className = 'ys-sw'; i.setAttribute('data-k', k); return i; }
  function makeSelect(k, opts) { const s = document.createElement('select'); s.className = 'ys-sel'; s.setAttribute('data-k', k); opts.forEach(o => { const op = document.createElement('option'); op.value = o.value; op.textContent = o.label; s.appendChild(op); }); return s; }
  function row(label, input) { const l = document.createElement('label'); l.className = 'ys-row'; const sp = document.createElement('span'); sp.textContent = label; l.appendChild(sp); l.appendChild(input); return l; }
  function sep() { const d = document.createElement('div'); d.className = 'ys-sep'; return d; }

  const panel = document.createElement('div'); panel.id = 'ys-panel';

  const header = document.createElement('div'); header.className = 'ys-h';
  const brand = document.createElement('div'); brand.className = 'ys-brand';
  const brandImg = document.createElement('img'); brandImg.src = ANIME_LOGO; brandImg.setAttribute('data-logo', '1');
  brand.appendChild(brandImg); brand.appendChild(document.createTextNode('YouSource'));
  const ver = document.createElement('span'); ver.textContent = 'v6.7'; brand.appendChild(ver);
  const closeBtn = document.createElement('button'); closeBtn.type = 'button'; closeBtn.className = 'ys-x'; closeBtn.setAttribute('data-act', 'close'); closeBtn.textContent = '✕';
  header.appendChild(brand); header.appendChild(closeBtn); panel.appendChild(header);

  const tabNav = document.createElement('div'); tabNav.className = 'ys-tabs';
  const tabs = ['Core', 'Tools', 'ServerBind', 'Update'];
  tabs.forEach((t, i) => {
    const btn = document.createElement('button'); btn.className = 'ys-tab' + (i === 0 ? ' active' : ''); btn.textContent = t;
    btn.setAttribute('data-tab', t.toLowerCase());
    tabNav.appendChild(btn);
  });
  panel.appendChild(tabNav);

  const tabContents = document.createElement('div'); tabContents.className = 'ys-tabs-content';
  
  const tabCore = document.createElement('div'); tabCore.className = 'ys-content active'; tabCore.setAttribute('data-content', 'core');
  tabCore.appendChild(row('Enabled', makeSwitch('on')));
  tabCore.appendChild(sep());
  
  tabCore.appendChild(row('Logo Style', makeSelect('logoType', [
    { value: 'anime', label: 'Anime (Random Waifu)' }, { value: 'symbol', label: 'YouTube Symbol' }
  ])));

  tabCore.appendChild(sep());
  const regionOpts = [{ value: '', label: 'Any language' }];
  for (const k in { IN:'Hindi / India', BD:'Bengali', JP:'Japanese', KR:'Korean', CN:'Chinese', RU:'Russian', SA:'Arabic', TH:'Thai', IL:'Hebrew', GR:'Greek', ID:'Indonesian', TR:'Turkish', VN:'Vietnamese', FR:'French', DE:'German', ES:'Spanish', PT:'Portuguese', IT:'Italian', PL:'Polish' }) regionOpts.push({ value: k, label: { IN:'Hindi / India', BD:'Bengali', JP:'Japanese', KR:'Korean', CN:'Chinese', RU:'Russian', SA:'Arabic', TH:'Thai', IL:'Hebrew', GR:'Greek', ID:'Indonesian', TR:'Turkish', VN:'Vietnamese', FR:'French', DE:'German', ES:'Spanish', PT:'Portuguese', IT:'Italian', PL:'Polish' }[k] });
  tabCore.appendChild(row('Region Spoof', makeSelect('region', regionOpts)));
  tabCore.appendChild(row('Strict region (hide unknown)', makeSwitch('strictRegion')));
  const regionHint = document.createElement('div'); regionHint.className = 'ys-hint'; regionHint.textContent = 'Spoofs language by scanning title and metadata. Unknown languages are kept unless Strict is on.';
  tabCore.appendChild(regionHint);
  
  tabCore.appendChild(sep());
  const restoreBtn = document.createElement('button'); restoreBtn.className = 'ys-btn'; restoreBtn.textContent = 'Restore Removed Videos'; restoreBtn.style.marginTop = '10px';
  restoreBtn.addEventListener('click', () => {
    if (!S.removedVideos || S.removedVideos.length === 0) { toast('No removed videos to restore.', 'info', 2000); return; }
    S.removedVideos.forEach(vidUrl => {
      const cards = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
      cards.forEach(card => {
        const link = card.querySelector('a#thumbnail') || card.querySelector('a#video-title-link') || card.querySelector('a');
        if (link && link.href.includes(vidUrl)) {
          card.style.display = '';
        }
      });
    });
    S.removedVideos = [];
    save();
    toast('All removed videos restored!', 'success', 2000);
  });
  tabCore.appendChild(restoreBtn);
  
  tabContents.appendChild(tabCore);

  const tabTools = document.createElement('div'); tabTools.className = 'ys-content'; tabTools.setAttribute('data-content', 'tools');
  const toolSearchWrap = document.createElement('div'); toolSearchWrap.className = 'ys-tool-search';
  const toolSearch = document.createElement('input'); toolSearch.type = 'text'; toolSearch.className = 'ys-input'; toolSearch.placeholder = 'Search 250+ tools...';
  toolSearchWrap.appendChild(toolSearch); tabTools.appendChild(toolSearchWrap);
  
  const toolListContainer = document.createElement('div'); toolListContainer.className = 'ys-tool-list';
  tabTools.appendChild(toolListContainer);
  
  const loadMoreBtn = document.createElement('button'); loadMoreBtn.className = 'ys-btn ys-more-btn'; loadMoreBtn.textContent = 'Load More'; loadMoreBtn.style.display = 'none';
  tabTools.appendChild(loadMoreBtn);
  
  let toolRenderLimit = 50;
  
  function renderTools() {
    while (toolListContainer.firstChild) toolListContainer.removeChild(toolListContainer.firstChild);
    const q = toolSearch.value.toLowerCase();
    const filtered = TOOLS.filter(t => t.label.toLowerCase().includes(q) || t.id.includes(q));
    
    const toRender = filtered.slice(0, toolRenderLimit);
    
    toRender.forEach(t => {
      const r = row(t.label, makeSwitch(t.id));
      if (S[t.id]) r.querySelector('input').checked = true;
      toolListContainer.appendChild(r);
    });
    
    if (filtered.length > toolRenderLimit) {
      loadMoreBtn.style.display = 'flex';
      loadMoreBtn.textContent = `Load More (${filtered.length - toolRenderLimit} remaining)`;
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }
  
  toolSearch.addEventListener('input', () => { toolRenderLimit = 50; renderTools(); });
  loadMoreBtn.addEventListener('click', () => { toolRenderLimit += 100; renderTools(); });
  tabContents.appendChild(tabTools);

  const tabServer = document.createElement('div'); tabServer.className = 'ys-content'; tabServer.setAttribute('data-content', 'serverbind');
  
  const statusBox = document.createElement('div'); statusBox.className = 'ys-status-box';
  const statusDot = document.createElement('div'); statusDot.id = 'ys-status-dot'; statusDot.className = 'ys-status-dot';
  const statusText = document.createElement('div'); statusText.id = 'ys-status-text'; statusText.className = 'ys-status-text'; statusText.textContent = 'Disconnected';
  statusBox.appendChild(statusDot); statusBox.appendChild(statusText);
  tabServer.appendChild(statusBox);

  tabServer.appendChild(row('Enable ServerBind', makeSwitch('serverBindEnabled')));
  
  const bindHint = document.createElement('div'); bindHint.className = 'ys-hint';
  bindHint.textContent = 'Requests will be routed directly to your bridge. NO SPY.';
  tabServer.appendChild(bindHint);

  const urlWrap = document.createElement('div'); urlWrap.className = 'ys-ken';
  const urlInput = document.createElement('input'); urlInput.type = 'text'; urlInput.placeholder = 'http://localhost:5000'; urlInput.setAttribute('data-k', 'bridgeUrl');
  urlWrap.appendChild(urlInput); tabServer.appendChild(urlWrap);
  
  const connectBtn = document.createElement('button'); connectBtn.className = 'ys-btn'; connectBtn.style.marginTop = '8px'; connectBtn.textContent = 'Ask for Local Network Access & Connect';
  tabServer.appendChild(connectBtn);
  
  const btnWrap = document.createElement('div'); btnWrap.style.display = 'flex'; btnWrap.style.gap = '8px'; btnWrap.style.marginTop = '10px';
  
  const pyBtn = document.createElement('button'); pyBtn.className = 'ys-btn'; pyBtn.style.flex = '1'; pyBtn.textContent = 'Python Bridge';
  const pyIcon = document.createElement('i'); pyIcon.className = 'ri-download-line'; pyBtn.prepend(pyIcon);
  
  const jsBtn = document.createElement('button'); jsBtn.className = 'ys-btn'; jsBtn.style.flex = '1'; jsBtn.textContent = 'JS Script';
  const jsIcon = document.createElement('i'); jsIcon.className = 'ri-download-line'; jsBtn.prepend(jsIcon);

  btnWrap.appendChild(pyBtn); btnWrap.appendChild(jsBtn);
  tabServer.appendChild(btnWrap);

  const tutorial = document.createElement('div'); tutorial.className = 'ys-hint'; tutorial.style.marginTop = '15px';
  const b1 = document.createElement('b'); b1.textContent = 'How to use:';
  tutorial.appendChild(b1); tutorial.appendChild(document.createElement('br'));
  tutorial.appendChild(document.createTextNode('1. Download the Python script.'));
  tutorial.appendChild(document.createElement('br'));
  tutorial.appendChild(document.createTextNode('2. Run '));
  const c1 = document.createElement('code'); c1.textContent = 'pip install flask flask_cors requests yt_dlp'; tutorial.appendChild(c1);
  tutorial.appendChild(document.createTextNode('.'));
  tutorial.appendChild(document.createElement('br'));
  tutorial.appendChild(document.createTextNode('3. Run '));
  const c2 = document.createElement('code'); c2.textContent = 'python bridge.py'; tutorial.appendChild(c2);
  tutorial.appendChild(document.createTextNode('.'));
  tutorial.appendChild(document.createElement('br'));
  tutorial.appendChild(document.createTextNode('4. Enter '));
  const c3 = document.createElement('code'); c3.textContent = 'http://localhost:5000'; tutorial.appendChild(c3);
  tutorial.appendChild(document.createTextNode(' and click Connect.'));
  tabServer.appendChild(tutorial);
  tabContents.appendChild(tabServer);

  const tabUpdate = document.createElement('div'); tabUpdate.className = 'ys-content'; tabUpdate.setAttribute('data-content', 'update');
  const updateHint = document.createElement('div'); updateHint.className = 'ys-hint';
  updateHint.textContent = 'Checks GitHub for a newer version of YouSource. Requires internet access.';
  tabUpdate.appendChild(updateHint);
  tabUpdate.appendChild(row('Auto Update', makeSwitch('autoUpdate')));
  tabUpdate.appendChild(sep());
  const checkUpdateBtn = document.createElement('button'); checkUpdateBtn.className = 'ys-btn'; checkUpdateBtn.textContent = 'Check for Updates'; checkUpdateBtn.style.marginTop = '10px';
  tabUpdate.appendChild(checkUpdateBtn);
  tabContents.appendChild(tabUpdate);

  panel.appendChild(tabContents);

  const foot = document.createElement('div'); foot.className = 'ys-foot';
  const stat = document.createElement('span'); stat.className = 'ys-stat'; stat.textContent = 'all clear';
  foot.appendChild(stat); panel.appendChild(foot);

  document.body.appendChild(panel);

  tabNav.addEventListener('click', e => {
    const btn = e.target.closest('.ys-tab');
    if (!btn) return;
    tabNav.querySelectorAll('.ys-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-tab');
    tabContents.querySelectorAll('.ys-content').forEach(c => c.classList.remove('active'));
    tabContents.querySelector('[data-content="' + target + '"]').classList.add('active');
    if (target === 'tools') renderTools();
  });

  panel.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (!a) return;
    if (a.getAttribute('data-act') === 'close') panel.style.display = 'none';
    else if (a.getAttribute('data-act') === 'reset') resetAll();
  });

  panel.addEventListener('change', e => {
    const t = e.target.closest('[data-k]'); if (!t) return;
    const k = t.getAttribute('data-k');
    
    if (t.type === 'checkbox') S[k] = t.checked;
    else S[k] = t.value;

    save(); apply();
    
    if (k === 'logoType') {
      panel.querySelectorAll('img[data-logo]').forEach(img => img.src = S.logoType === 'anime' ? ANIME_LOGO : SYMBOL_LOGO);
      fab.querySelector('img').src = S.logoType === 'anime' ? ANIME_LOGO : SYMBOL_LOGO;
      updateWatermark();
    }
    if (k === 'serverBindEnabled') {
      startPing();
    }
  });

  connectBtn.addEventListener('click', async () => {
    const url = S.bridgeUrl || 'http://localhost:5000';
    if (!S.bridgeUrl) { S.bridgeUrl = url; save(); }
    
    pingStatus = 'connecting';
    updateServerStatusUI();
    toast('Requesting local network access...', 'info', 3000);
    
    try {
      await fetch(url + '/ping', { mode: 'cors' });
      pingStatus = 'connected';
      updateServerStatusUI();
      S.serverBindEnabled = true;
      save();
      const sw = document.querySelector('[data-k="serverBindEnabled"]');
      if (sw) sw.checked = true;
      toast('Connected! Requests will route to your bridge. NO SPY.', 'success', 5000);
      startPing();
    } catch (e) {
      pingStatus = 'disconnected';
      updateServerStatusUI();
      toast('Connection failed. Is the Python bridge running?', 'error', 5000);
    }
  });

  checkUpdateBtn.addEventListener('click', checkForUpdates);

  pyBtn.addEventListener('click', () => {
    const code = `from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import requests
import yt_dlp

app = Flask(__name__)
CORS(app)

@app.route('/ping')
def ping():
    return jsonify({"status": "ok"})

@app.route('/suggest')
def suggest():
    q = request.args.get('q', '')
    try:
        r = requests.get(f'https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q={q}')
        return jsonify(r.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/proxy')
def proxy():
    url = request.args.get('url')
    if not url: return jsonify({"error": "no url"}), 400
    try:
        r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        return Response(r.content, status=r.status_code, content_type=r.headers.get('Content-Type'))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download')
def download():
    url = request.args.get('url')
    quality = request.args.get('quality', '1080p')
    if not url: return jsonify({"error": "no url"}), 400
    
    home_dir = os.path.expanduser("~")
    dl_dir = os.path.join(home_dir, "youSearch")
    os.makedirs(dl_dir, exist_ok=True)
    
    fmt = 'bestvideo+bestaudio/best'
    if 'Audio' in quality: fmt = 'bestaudio/best'
    elif '720' in quality: fmt = 'bestvideo[height<=720]+bestaudio/best'
    elif '480' in quality: fmt = 'bestvideo[height<=480]+bestaudio/best'
    elif '360' in quality: fmt = 'bestvideo[height<=360]+bestaudio/best'
    
    ydl_opts = {
        'outtmpl': os.path.join(dl_dir, '%(title)s.%(ext)s'),
        'format': fmt
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return jsonify({"status": "success", "path": dl_dir})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bridge.py'; a.click();
    URL.revokeObjectURL(url);
  });
  
  jsBtn.addEventListener('click', () => {
    const code = "// Paste your YouSource script here";
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'yousource.js'; a.click();
    URL.revokeObjectURL(url);
  });

  function syncPanel() {
    panel.querySelectorAll('[data-k]').forEach(el => {
      const k = el.getAttribute('data-k');
      if (el.type === 'checkbox') el.checked = !!S[k];
      else el.value = S[k] || '';
    });
    updateStat();
    updateServerStatusUI();
  }

  function resetAll() {
    S = Object.assign({}, DEF);
    save(); syncPanel(); apply();
    toast('YouSource reset to defaults.', 'success', 2000);
  }

  const fab = document.createElement('button'); fab.id = 'ys-fab'; fab.type = 'button'; fab.title = 'YouSource settings';
  const fabImg = document.createElement('img'); fabImg.src = ANIME_LOGO;
  fab.appendChild(fabImg); document.body.appendChild(fab);
  fab.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const isOpen = panel.style.display === 'flex';
    panel.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) syncPanel();
  });

  function updateStat() {
    fab.classList.toggle('ys-off', !S.on);
    const st = panel.querySelector('.ys-stat');
    if (st) st.textContent = S.on ? 'Active' : 'Disabled';
  }

  function apply() {
    document.documentElement.classList.toggle('ys-on', !!S.on);
    
    if (!S.on) {
      document.querySelectorAll('[data-ys-hidden]').forEach(el => { el.style.display = ''; delete el.dataset.ysHidden; });
      document.documentElement.className = document.documentElement.className.replace(/\bys-[a-z-]+\b/g, '');
      updateStat(); updateWatermark(); updateToolCSS(); return;
    }
    
    document.documentElement.classList.toggle('ys-minimal', !!S.minimal);
    
    updateStat();
    updateWatermark();
    updateToolCSS();
  }

  let sugEl = null, sugItems = [], sugSel = -1, sugSeq = 0, sugTimer = null;
  function hideSug() { if (sugEl) { sugEl.remove(); sugEl = null; } sugItems = []; sugSel = -1; }
  function isSearchInput(t) { return t && t.tagName === 'INPUT' && (t.id === 'search' || t.name === 'search_query' || !!t.closest('ytd-searchbox, #search-form')); }
  
  function remoteSug(q, cb) {
    const seq = ++sugSeq; const ctrl = new AbortController(); const tid = setTimeout(() => ctrl.abort(), 2000);
    
    let url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=en&ds=yt&q=' + encodeURIComponent(q);
    if (S.serverBindEnabled && S.bridgeUrl) {
      url = S.bridgeUrl.replace(/\/$/, '') + '/suggest?q=' + encodeURIComponent(q);
    }

    ysFetch(url, { signal: ctrl.signal, credentials: 'omit', mode: 'cors' })
      .then(r => r.json()).then(data => {
        clearTimeout(tid); if (seq !== sugSeq) return;
        const arr = (Array.isArray(data) && Array.isArray(data[1])) ? data[1].filter(x => typeof x === 'string') : [];
        cb(arr);
      }).catch(() => { clearTimeout(tid); if (seq === sugSeq) cb([]); });
  }

  function renderSug(list, input) {
    const seen = new Set(); list = list.filter(it => { const k = it.text.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
    if (!list.length) { hideSug(); return; }
    sugItems = list; sugSel = -1;
    if (!sugEl) { sugEl = document.createElement('div'); sugEl.id = 'ys-sug'; document.body.appendChild(sugEl); }
    while (sugEl.firstChild) sugEl.removeChild(sugEl.firstChild);
    list.forEach(it => {
      const row = document.createElement('div'); row.className = 'ys-sug-item';
      const k = document.createElement('span'); k.className = 'ys-sug-k'; k.textContent = it.type === 'video' ? 'VID' : 'SRCH';
      const t = document.createElement('span'); t.className = 'ys-sug-t'; t.textContent = it.text;
      row.appendChild(k); row.appendChild(t);
      row.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); hideSug(); doSearch(it.text); });
      sugEl.appendChild(row);
    });
    const box = input.closest('ytd-searchbox') || input.closest('#search-form') || input;
    const r = box.getBoundingClientRect();
    sugEl.style.left = Math.max(8, r.left) + 'px'; sugEl.style.top = (r.bottom + 6) + 'px'; sugEl.style.width = Math.max(r.width, 320) + 'px';
  }

  function doSearch(q) {
    const input = document.querySelector('input#search');
    if (input) { input.value = q; input.dispatchEvent(new Event('input', { bubbles: true })); }
    const btn = document.querySelector('#search-icon-legacy');
    if (btn) btn.click(); else location.href = '/results?search_query=' + encodeURIComponent(q);
  }

  function onSearchInput(e) {
    if (!isSearchInput(e.target)) return;
    const q = (e.target.value || '').trim();
    if (!S.on || !S.suggest || q.length < 2) { hideSug(); return; }
    sugSeq++;
    const immediate = [{ type: 'search', text: q }];
    renderSug(immediate, e.target);
    clearTimeout(sugTimer);
    sugTimer = setTimeout(() => {
      remoteSug(q, remote => {
        const merged = immediate.slice(); remote.forEach(r => merged.push({ type: 'search', text: r }));
        renderSug(merged.slice(0, 8), e.target);
      });
    }, 140);
  }

  document.addEventListener('input', onSearchInput, true);
  document.addEventListener('focusin', e => { if (isSearchInput(e.target)) onSearchInput({ target: e.target }); }, true);
  document.addEventListener('mousedown', e => { if (sugEl && !e.target.closest('#ys-sug')) hideSug(); }, true);

  const ctxMenu = document.createElement('div');
  ctxMenu.id = 'ys-ctx-menu';
  document.body.appendChild(ctxMenu);

  let currentVideoUrl = '';
  let currentCard = null;

  function hideCtxMenu() { ctxMenu.style.display = 'none'; }

  function showQualityMenu() {
    while (ctxMenu.firstChild) ctxMenu.removeChild(ctxMenu.firstChild);
    
    const qualities = ['1080p', '720p', '480p', '360p', 'Audio Only'];
    qualities.forEach(q => {
      const opt = document.createElement('div');
      opt.className = 'ys-ctx-item';
      opt.textContent = q;
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        hideCtxMenu();
        startDownload(currentVideoUrl, q);
      });
      ctxMenu.appendChild(opt);
    });
  }

  async function startDownload(url, quality) {
    if (S.serverBindEnabled && S.bridgeUrl && pingStatus === 'connected') {
      toast(`Starting download on server (${quality})...`, 'info', 3000);
      try {
        const res = await fetch(S.bridgeUrl.replace(/\/$/, '') + '/download?url=' + encodeURIComponent(url) + '&quality=' + encodeURIComponent(quality));
        if (res.ok) toast('Download initiated! Check ~/youSearch', 'success', 4000);
        else toast('Server rejected download.', 'error', 3000);
      } catch (e) {
        toast('Download request failed.', 'error', 3000);
      }
    } else {
      toast('Opening downloader service...', 'info', 3000);
      window.open('https://cobalt.tools/?u=' + encodeURIComponent(url), '_blank');
    }
  }

  function openContextMenu(x, y, card) {
    const link = card.querySelector('a#thumbnail') || card.querySelector('a#video-title-link') || card.querySelector('a');
    if (!link || !link.href) return;

    currentVideoUrl = link.href;
    currentCard = card;

    while (ctxMenu.firstChild) ctxMenu.removeChild(ctxMenu.firstChild);

    const dlBtn = document.createElement('div');
    dlBtn.className = 'ys-ctx-item';
    dlBtn.textContent = 'Download video';
    dlBtn.addEventListener('click', (ev) => { ev.stopPropagation(); showQualityMenu(); });

    const rmBtn = document.createElement('div');
    rmBtn.className = 'ys-ctx-item';
    rmBtn.textContent = 'Remove from list';
    rmBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (currentCard) {
        currentCard.style.display = 'none';
        if (!S.removedVideos.includes(currentVideoUrl)) {
          S.removedVideos.push(currentVideoUrl);
          save();
        }
      }
      hideCtxMenu();
      toast('Video removed from list.', 'info', 2000);
    });

    const copyBtn = document.createElement('div');
    copyBtn.className = 'ys-ctx-item';
    copyBtn.textContent = 'Copy Link';
    copyBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      navigator.clipboard.writeText(currentVideoUrl);
      hideCtxMenu();
      toast('Link copied to clipboard!', 'success', 2000);
    });

    const newTabBtn = document.createElement('div');
    newTabBtn.className = 'ys-ctx-item';
    newTabBtn.textContent = 'Open in new tab';
    newTabBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      window.open(currentVideoUrl, '_blank');
      hideCtxMenu();
    });

    ctxMenu.appendChild(dlBtn);
    ctxMenu.appendChild(rmBtn);
    ctxMenu.appendChild(copyBtn);
    ctxMenu.appendChild(newTabBtn);

    ctxMenu.style.left = Math.min(x, window.innerWidth - 220) + 'px';
    ctxMenu.style.top = Math.min(y, window.innerHeight - 200) + 'px';
    ctxMenu.style.display = 'flex';
  }

  document.addEventListener('contextmenu', (e) => {
    const card = e.target.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-reel-item-renderer');
    if (!card) {
      if (ctxMenu.style.display === 'flex') hideCtxMenu();
      return;
    }
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, card);
  });

  function injectThreeDots() {
    document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-reel-item-renderer').forEach(card => {
      if (card.querySelector('.ys-3dots')) return;
      const thumb = card.querySelector('ytd-thumbnail');
      if (!thumb) return;
      const btn = document.createElement('div');
      btn.className = 'ys-3dots';
      
      const icon = document.createElement('i');
      icon.className = 'ri-more-fill';
      btn.appendChild(icon);
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = btn.getBoundingClientRect();
        openContextMenu(rect.left, rect.bottom, card);
      });
      
      if (getComputedStyle(thumb).position === 'static') thumb.style.position = 'relative';
      thumb.appendChild(btn);
    });

    const playerContainer = document.querySelector('#movie_player') || document.querySelector('#shorts-player');
    if (playerContainer && !playerContainer.querySelector('.ys-3dots-player')) {
      const btn = document.createElement('div');
      btn.className = 'ys-3dots-player';
      
      const icon = document.createElement('i');
      icon.className = 'ri-more-fill';
      btn.appendChild(icon);
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = btn.getBoundingClientRect();
        const fakeCard = document.createElement('div');
        const a = document.createElement('a');
        a.href = location.href;
        fakeCard.appendChild(a);
        openContextMenu(rect.left, rect.bottom, fakeCard);
      });
      
      playerContainer.appendChild(btn);
    }
  }

  window.__ysDotsObs = new MutationObserver(() => { injectThreeDots(); });
  window.__ysDotsObs.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#ys-ctx-menu')) hideCtxMenu();
  });

  function addAnimations() {
    document.addEventListener('click', e => {
      const subBtn = e.target.closest('ytd-subscribe-button-renderer');
      if (subBtn) {
        subBtn.style.transform = 'scale(0.9)';
        setTimeout(() => subBtn.style.transform = 'scale(1)', 150);
      }
      const likeBtn = e.target.closest('#top-level-buttons-computed > ytd-toggle-button-renderer:first-child');
      if (likeBtn) {
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => likeBtn.style.transform = 'scale(1)', 150);
      }
    });
  }

  window.addEventListener('yt-navigate-finish', () => { 
    hideSug(); 
    hideCtxMenu(); 
    setTimeout(() => { 
      apply(); 
      injectThreeDots(); 
    }, 150); 
  });

  syncPanel(); apply(); renderTools(); injectThreeDots(); addAnimations();
  
  fetchAnimeLogo().then(url => {
    ANIME_LOGO = url;
    if (S.logoType === 'anime') {
      panel.querySelectorAll('img[data-logo]').forEach(img => img.src = ANIME_LOGO);
      fabImg.src = ANIME_LOGO;
      updateWatermark();
    }
    loaderImg.src = ANIME_LOGO;
  });

  setTimeout(() => {
    loader.classList.add('ys-hide');
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 600);
    toast('YouSource v6.7 Ready. 250+ tools loaded.', 'success', 3000);
  }, 1500);

  if (S.serverBindEnabled) startPing();
  if (S.autoUpdate) setTimeout(checkForUpdates, 4000);

  window.__YouSource = {
    open: () => { panel.style.display = 'flex'; syncPanel(); },
    close: () => { panel.style.display = 'none'; },
    toggle: () => { panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex'; },
    apply, reset: resetAll,
    toast,
    get settings() { return S; },
    set(p) { Object.assign(S, p); save(); syncPanel(); apply(); }
  };

})();
