(function() {
    console.log("device-redirect.js is running");
    const ua = navigator.userAgent;
    const isSP = (ua.indexOf('iPhone') > 0 ||
        (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) ||
        ua.indexOf('Windows Phone') > 0 ||
        window.innerWidth <= 800);
    if (isSP) {
        location.replace('./sp/');
    } else {
        location.replace('./pc/');
    }
})();