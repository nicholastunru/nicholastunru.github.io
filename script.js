document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-container');

    function showSection(id) {
        sections.forEach(sec => {
            sec.style.display = sec.id === id ? 'block' : 'none';
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    }

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href').substring(1);
            showSection(id);
        });
    });

    // Show the first section by default
    showSection('about');

    // Add animation to skill bars
    setTimeout(() => {
        document.querySelectorAll('.bar-fill').forEach(bar => {
            bar.style.width = bar.style.width;
        });
    }, 300);

    // Inject minimal styles for tech bubbles (so you don't need to edit CSS files)
    (function injectTechBubbleStyles() {
        const css = `
            .tech-bubbles { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
            .tech-bubble { font-size:12px; padding:4px 8px; border-radius:999px; display:inline-block; line-height:1; box-shadow:0 1px 2px rgba(0,0,0,0.08); }
        `;
        const style = document.createElement('style');
        style.setAttribute('data-generated','tech-bubbles');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    })();

    // Create tech bubbles from data-tech attribute on elements with class "project"
    function createTechBubblesForProject(projectEl) {
        if (!projectEl) return;
        const techAttr = projectEl.getAttribute('data-tech');
        if (!techAttr) return;
        let wrapper = projectEl.querySelector('.tech-bubbles');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'tech-bubbles';
            projectEl.appendChild(wrapper);
        } else {
            wrapper.innerHTML = '';
        }

        const colorMap = {
            'html': '#e34c26', 'css': '#1572B6', 'javascript': '#F7DF1E', 'js': '#F7DF1E',
            'python': '#3572A5', 'django': '#092E20', 'flask': '#000000',
            'react': '#61DAFB', 'node': '#3C873A', 'typescript': '#3178C6'
        };

        function contrastColor(hex) {
            hex = hex.replace('#','');
            if (hex.length === 3) hex = hex.split('').map(h => h+h).join('');
            const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
            const brightness = (r*299 + g*587 + b*114) / 1000;
            return brightness > 128 ? '#000' : '#fff';
        }

        const techs = techAttr.split(',').map(t => t.trim()).filter(Boolean);
        techs.forEach(t => {
            const key = t.toLowerCase();
            const span = document.createElement('span');
            span.className = 'tech-bubble tech-' + key.replace(/\s+/g,'-');
            span.textContent = t;
            const bg = colorMap[key] || '#6b7280'; // gray fallback
            span.style.backgroundColor = bg;
            span.style.color = contrastColor(bg);
            wrapper.appendChild(span);
        });
    }

    // Process all projects on load
    document.querySelectorAll('.project').forEach(createTechBubblesForProject);

    // Optionally, when a section becomes visible, (re)create bubbles for projects inside it
    // so dynamic content or lazy-loaded sections get bubbles as well.
    function createBubblesInVisibleSection(id) {
        const sec = document.getElementById(id);
        if (!sec) return;
        sec.querySelectorAll('.project').forEach(createTechBubblesForProject);
    }

    // Hook into showSection so visible section projects are prepared
    const originalShow = showSection;
    showSection = function(id) {
        originalShow(id);
        createBubblesInVisibleSection(id);
    };
});