function SPLStartGame(onSuccess, onError) {
  getDomain(function(url) {
    if (url !== undefined) {
      var params = onSuccess(url)
      if (!params) {
        return
      }

      loadScript(
        url,
        function() {
          params.server = url
          new SPLFrame(params);
        },
        function() {
          onError()
        })
    } else {
      onError()
    }
  })

  function getDomain(callback) {
    var xhr = new XMLHttpRequest();
    var url = 'https://raw.githubusercontent.com/spltdev/game-launch-staging/refs/heads/main/domain.txt'

    xhr.open('GET', url + '?t=' + (new Date).getTime(), true);
    xhr.timeout = 30000;

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) && xhr.responseText) {
        callback(xhr.responseText)
      } else {
        callback()
      }
    }

    xhr.send()
  }

  function loadScript(domain, loadSuccess, loadError) {
    var script = document.createElement('script');
    script.src = domain + '/compiled/js/iframe.js';

    script.onload = loadSuccess
    script.onerror = loadError

    document.head.appendChild(script);
  }
}
