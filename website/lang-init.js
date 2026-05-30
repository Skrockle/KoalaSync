(function() {
    var savedLang = localStorage.getItem('koala_lang');
    var browserLang = navigator.language.startsWith('de') ? 'de' : 'en';
    var activeLang = savedLang || browserLang;
    document.documentElement.classList.add('lang-' + activeLang);
    document.documentElement.lang = activeLang;
    
    // Update titles dynamically based on page
    var path = window.location.pathname;
    var isIndex = path === '/' || path.endsWith('index.html') || path.split('/').pop() === '';
    var isJoin = path.includes('join');
    
    if (isIndex) {
        var titles = { 
            en: 'KoalaSync | Real-time Video Synchronization for Friends', 
            de: 'KoalaSync | Echtzeit-Video-Synchronisation für Freunde' 
        };
        document.title = titles[activeLang] || titles.en;
    } else if (isJoin) {
        var titles = { 
            en: 'Join Room | KoalaSync', 
            de: 'Raum beitreten | KoalaSync' 
        };
        document.title = titles[activeLang] || titles.en;
    }
})();
