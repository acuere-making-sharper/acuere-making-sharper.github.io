(function () {
  'use strict';

  angular.module('acuereApp', [])
    .controller('ReaderController', ['$http', '$q', '$sce', '$scope', function ($http, $q, $sce, $scope) {
      var contentCache = {};
      var selectedGuide = new URLSearchParams(window.location.search).get('guide');

      $scope.guides = [
        { title: '.NET Clean Architecture Complete Guide', file: 'dotnet-clean-architecture-complete-guide.md', meta: 'dotnet, clean-architecture, ddd, csharp' },
        { title: 'Claude Code Complete Guide', file: 'claude-code-complete-guide.md', meta: 'claude-code, ai, cli, agentic-coding' },
        { title: 'Top Claude Code Plugins for End-to-End Product Development', file: 'top-claude-code-plugins-end-to-end-product-development-complete-guide.md', meta: 'claude-code, plugins, productivity' },
        { title: 'AI Fundamentals Complete Guide', file: 'ai-fundamentals-complete-guide.md', meta: 'ai, artificial-intelligence, machine-learning' },
        { title: 'RAG Retrieval-Augmented Generation Complete Guide', file: 'retrieval-augmented-generation-rag-complete-guide.md', meta: 'rag, vector-database, embeddings' },
        { title: 'Claude Code Plugins Complete Guide', file: 'claude-code-plugins-complete-guide.md', meta: 'claude-code, plugins, extensions' },
        { title: 'Claude Complete Guide', file: 'claude-complete-guide.md', meta: 'claude, ai, anthropic' },
        { title: 'Microsoft Agent Framework Complete Guide', file: 'maf-microsoft-agent-framework-complete-guide.md', meta: 'maf, agents, microsoft' },
        { title: 'LLM Large Language Model Complete Guide', file: 'llm-large-language-model-complete-guide.md', meta: 'llm, language-models, ai' },
        { title: '.NET Performance Optimization Complete Guide', file: 'dotnet-performance-optimization-complete-guide.md', meta: 'dotnet, performance, optimization' },
        { title: 'Git Complete Guide', file: 'git-complete-guide.md', meta: 'git, version-control, workflows' },
        { title: 'React Complete Guide', file: 'react-complete-guide.md', meta: 'react, javascript, frontend' }
      ];

      $scope.quickLinks = [
        { title: 'GitHub Profile', url: 'https://github.com/utpal-maiti', external: true },
        { title: 'ChatGPT AI Assistant', url: 'https://chatgpt.com/', external: true },
        { title: 'Developer Roadmaps', url: 'https://roadmap.sh/', external: true },
        { title: 'LinkedIn', url: 'https://www.linkedin.com/in/utpal-maiti/', external: true },
        { title: 'Skills Directory', url: 'https://skills.sh/', external: true },
        { title: 'Acuere Group', url: 'https://acuere.com/', external: true },
        { title: 'Product Development Skill Map', url: 'complete-end-to-end-product-development-skill-map-complete-guide.md', external: false }
      ];
      $scope.selectedGuide = selectedGuide;
      $scope.searchQuery = '';
      $scope.searchResults = [];
      $scope.view = selectedGuide ? 'loading' : 'home';

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

      $scope.openGuide = function (file) {
        window.location.href = 'index.html?guide=' + encodeURIComponent(file);
      };

      $scope.searchGuides = function () {
        var query = ($scope.searchQuery || '').toLowerCase().trim();
        if (!query) {
          $scope.view = 'home';
          return;
        }
        $scope.view = 'search';
        $scope.searching = true;
        $scope.searchResults = [];
        $q.all($scope.guides.map(function (guide) {
          return fetchGuide(guide.file).then(function (content) {
            return (guide.title + ' ' + guide.meta + ' ' + content).toLowerCase().indexOf(query) !== -1 ? guide : null;
          });
        })).then(function (results) {
          $scope.searchResults = results.filter(Boolean);
          $scope.searching = false;
        });
      };

      $scope.$watch('searchQuery', function (value, previousValue) {
        if (value !== previousValue) $scope.searchGuides();
      });

      if (selectedGuide) {
        fetchGuide(selectedGuide).then(function (markdown) {
          $scope.guideHtml = $sce.trustAsHtml(markdownToHtml(markdown));
          $scope.view = 'guide';
          document.title = 'Guide - Acuere';
        }).catch(function () {
          $scope.view = 'error';
        });
      }
    }]);
}());
