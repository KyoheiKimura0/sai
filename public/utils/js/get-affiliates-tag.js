(function() {
    try {
        const params = new URLSearchParams(window.location.search);
        // tagパラメータがあれば取得、なければnull
        window.affiliateTag = params.has('tag') ? params.get('tag') : null;
        console.log('get-affiliates-tag:', window.affiliateTag)
    } catch (e) {
        window.affiliateTag = null;
    }
})();