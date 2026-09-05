(function () {
  'use strict';

  angular.module('acuereApp', [])
    .controller('ReaderController', ['$http', '$q', '$sce', '$scope', '$timeout', function ($http, $q, $sce, $scope, $timeout) {
      var contentCache = {};
      var searchIndex = [];
      var indexingPromise;
      var searchTimer;
      var searchRequestId = 0;
      var selectedGuide = new URLSearchParams(window.location.search).get('guide');

      $scope.guides = [];
      $scope.quickLinks = [];
      $scope.selectedGuide = selectedGuide;
      $scope.searchQuery = '';
      $scope.searchResults = [];
      $scope.view = 'loading';

      function escapeHtml(value) {
        return value.replace(/[&<>"']/g, function (character) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
        });
      }

      function markdownToHtml(markdown) {
        var codeBlocks = [];
        var text = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, language, code) {
          codeBlocks.push('<pre><code class="language-' + language + '">' + escapeHtml(code.trim()) + '</code></pre>');
          return '\n@@CODE_' + (codeBlocks.length - 1) + '@@\n';
        });
        text = escapeHtml(text)
          .replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>')
          .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>').replace(/^---$/gm, '<hr>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
        text = text.replace(/(^|\n)([-*] .+(?:\n[-*] .+)*)/g, function (_, before, list) {
          return before + '<ul>' + list.trim().split('\n').map(function (item) { return '<li>' + item.slice(2) + '</li>'; }).join('') + '</ul>';
        });
        text = text.split(/\n{2,}/).map(function (block) {
          return /^(<h|<ul|<blockquote|<pre|<hr)/.test(block.trim()) ? block : '<p>' + block.replace(/\n/g, '<br>') + '</p>';
        }).join('\n');
        return text.replace(/@@CODE_(\d+)@@/g, function (_, index) { return codeBlocks[index]; });
      }

      function fetchGuide(file) {
        if (!contentCache[file]) {
          contentCache[file] = $http.get(file).then(function (response) { return response.data; });
        }
        return contentCache[file];
      }

      function buildSearchIndex() {
        if (indexingPromise) return indexingPromise;
        indexingPromise = $q.all($scope.guides.map(function (guide) {
          return fetchGuide(guide.file).then(function (content) {
            searchIndex.push({ guide: guide, text: (guide.title + ' ' + guide.meta + ' ' + content).toLowerCase() });
          });
        }));
        return indexingPromise;
      }

      $scope.guideUrl = function (file) {
        var guide = $scope.guides.find(function (item) { return item.file === file; });
        return guide && guide.slug ? new URL(guide.slug, window.location.origin + '/').href : new URL('index.html?guide=' + encodeURIComponent(file), window.location.href).href;
      };

      $scope.loadGuide = function (file) {
        $scope.selectedGuide = file;
        $scope.view = 'loading';
        fetchGuide(file).then(function (markdown) {
          $scope.guideHtml = $sce.trustAsHtml(markdownToHtml(markdown));
          $scope.view = 'guide';
          document.title = 'Guide - Acuere';
          $timeout(function () {
            var reader = document.getElementById('guide-reader');
            if (reader) reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }).catch(function () {
          $scope.view = 'error';
        });
      };

      $scope.openGuide = function (file) {
        window.open($scope.guideUrl(file), '_blank', 'noopener,noreferrer');
      };

      $scope.searchGuides = function () {
        var query = ($scope.searchQuery || '').toLowerCase().trim();
        var requestId = ++searchRequestId;
        if (!query) {
          $scope.view = $scope.selectedGuide ? 'guide' : 'home';
          $scope.searching = false;
          $scope.searchResults = [];
          return;
        }
        if (searchIndex.length === $scope.guides.length) {
          $scope.searchResults = searchIndex.filter(function (item) { return item.text.indexOf(query) !== -1; }).map(function (item) { return item.guide; });
          $scope.searching = false;
          return;
        }
        $scope.searching = true;
        buildSearchIndex().then(function () {
          if (requestId !== searchRequestId) return;
          $scope.searchResults = searchIndex.filter(function (item) { return item.text.indexOf(query) !== -1; }).map(function (item) { return item.guide; });
          $scope.searching = false;
        });
      };

      $scope.queueSearch = function () {
        if (searchTimer) $timeout.cancel(searchTimer);
        searchTimer = $timeout($scope.searchGuides, 300);
      };

      $http.get('data.json').then(function (response) {
        $scope.guides = response.data.guides || [];
        $scope.quickLinks = response.data.quickLinks || [];
        if (!selectedGuide) {
          $scope.view = 'home';
          return;
        }
        return fetchGuide(selectedGuide).then(function (markdown) {
          $scope.guideHtml = $sce.trustAsHtml(markdownToHtml(markdown));
          $scope.view = 'guide';
          document.title = 'Guide - Acuere';
        });
      }).catch(function () {
        $scope.view = 'error';
      });
    }]);
}());
