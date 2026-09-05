(function () {
  'use strict';

  angular.module('acuereApp', [])
    .controller('ReaderController', ['$http', '$interval', '$sce', '$scope', '$timeout', function ($http, $interval, $sce, $scope, $timeout) {
      var contentCache = {};
      var searchTimer;
      var searchRequestId = 0;
      var placeholderTimer;
      var placeholderIndex = 0;
      var placeholderExamples = [];
      var placeholderPosition = 0;
      var deletingPlaceholder = false;
      var selectedGuide = new URLSearchParams(window.location.search).get('guide');

      $scope.guides = [];
      $scope.quickLinks = [];
      $scope.selectedGuide = selectedGuide;
      $scope.searchQuery = '';
      $scope.searchPlaceholder = 'e.g. Explore a guide';
      $scope.autocompleteResults = [];
      $scope.searchResults = [];
      $scope.view = 'loading';

      function escapeHtml(value) {
        return value.replace(/[&<>"']/g, function (character) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
        });
      }

      function isSafeGuideFile(file) {
        return typeof file === 'string' && /^[a-z0-9][a-z0-9-]*\.md$/i.test(file);
      }

      function safeLinkUrl(value) {
        try {
          var url = new URL(value, window.location.href);
          if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
          if (url.origin === window.location.origin && url.pathname.endsWith('.md')) return url.href;
        } catch (error) {
          return '';
        }
        return '';
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
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
            var safeHref = safeLinkUrl(href);
            return safeHref ? '<a href="' + safeHref + '" target="_blank" rel="noopener noreferrer">' + label + '</a>' : label;
          });
        text = text.replace(/(^|\n)([-*] .+(?:\n[-*] .+)*)/g, function (_, before, list) {
          return before + '<ul>' + list.trim().split('\n').map(function (item) { return '<li>' + item.slice(2) + '</li>'; }).join('') + '</ul>';
        });
        text = text.split(/\n{2,}/).map(function (block) {
          return /^(<h|<ul|<blockquote|<pre|<hr)/.test(block.trim()) ? block : '<p>' + block.replace(/\n/g, '<br>') + '</p>';
        }).join('\n');
        return text.replace(/@@CODE_(\d+)@@/g, function (_, index) { return codeBlocks[index]; });
      }

      function fetchGuide(file) {
        if (!isSafeGuideFile(file)) return Promise.reject(new Error('Invalid guide file'));
        if (!contentCache[file]) {
          contentCache[file] = $http.get(file).then(function (response) { return response.data; });
        }
        return contentCache[file];
      }

      function refreshIcons() {
        $timeout(function () {
          if (window.lucide) window.lucide.createIcons();
        }, 0);
      }

      $scope.guideUrl = function (file) {
        var guide = $scope.guides.find(function (item) { return item.file === file; });
        if (!guide || !isSafeGuideFile(guide.file)) return '#';
        return guide.slug ? new URL(guide.slug, window.location.origin + '/').href : new URL('index.html?guide=' + encodeURIComponent(guide.file), window.location.href).href;
      };

      $scope.highlightMatch = function (value) {
        var safeValue = escapeHtml(value || '');
        var query = ($scope.searchQuery || '').trim();
        if (!query) return $sce.trustAsHtml(safeValue);
        var safeQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return $sce.trustAsHtml(safeValue.replace(new RegExp(safeQuery, 'ig'), '<mark>$&</mark>'));
      };

      $scope.loadGuide = function (file) {
        $scope.autocompleteResults = [];
        $scope.selectedGuide = file;
        $scope.view = 'loading';
        fetchGuide(file).then(function (markdown) {
          $scope.guideHtml = $sce.trustAsHtml(markdownToHtml(markdown));
          $scope.view = 'guide';
          document.title = 'Guide - Acuere';
          refreshIcons();
          $timeout(function () {
            var reader = document.getElementById('guide-reader');
            if (reader) reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }).catch(function () {
          $scope.view = 'error';
        });
      };

      $scope.openGuide = function (file) {
        var url = $scope.guideUrl(file);
        if (url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
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
        $scope.searching = false;
        $scope.searchResults = $scope.guides.filter(function (guide) {
          return (guide.title + ' ' + guide.meta).toLowerCase().indexOf(query) !== -1;
        });
        if (requestId === searchRequestId) refreshIcons();
      };

      $scope.queueSearch = function () {
        var query = ($scope.searchQuery || '').toLowerCase().trim();
        $scope.autocompleteResults = query ? $scope.guides.filter(function (guide) {
          return (guide.title + ' ' + guide.meta).toLowerCase().indexOf(query) !== -1;
        }).slice(0, 6) : [];
        refreshIcons();
        if (searchTimer) $timeout.cancel(searchTimer);
        searchTimer = $timeout($scope.searchGuides, 300);
      };

      placeholderTimer = $interval(function () {
        if ($scope.searchQuery || !placeholderExamples.length) return;
        var phrase = placeholderExamples[placeholderIndex];
        if (!deletingPlaceholder) {
          placeholderPosition += 1;
          $scope.searchPlaceholder = phrase.slice(0, placeholderPosition);
          if (placeholderPosition >= phrase.length) deletingPlaceholder = true;
        } else {
          placeholderPosition -= 1;
          $scope.searchPlaceholder = phrase.slice(0, placeholderPosition);
          if (placeholderPosition <= 0) {
            deletingPlaceholder = false;
            placeholderIndex = (placeholderIndex + 1) % placeholderExamples.length;
          }
        }
      }, 70);

      $scope.$on('$destroy', function () {
        $interval.cancel(placeholderTimer);
        if (searchTimer) $timeout.cancel(searchTimer);
      });

      $http.get('data.json').then(function (response) {
        $scope.guides = (response.data.guides || []).filter(function (guide) { return isSafeGuideFile(guide.file); });
        $scope.quickLinks = response.data.quickLinks || [];
        placeholderExamples = $scope.guides.map(function (guide) { return 'e.g. Explore ' + guide.title; });
        placeholderIndex = 0;
        placeholderPosition = placeholderExamples.length ? placeholderExamples[0].length : 0;
        deletingPlaceholder = placeholderExamples.length > 0;
        $scope.searchPlaceholder = placeholderExamples[0] || 'e.g. Explore a guide';
        refreshIcons();
        if (!selectedGuide) {
          $scope.view = 'home';
          return;
        }
        if (!$scope.guides.some(function (guide) { return guide.file === selectedGuide; })) {
          $scope.view = 'error';
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
