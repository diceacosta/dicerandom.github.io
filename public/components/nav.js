class Nav extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav>
                <div class="row">
                    <a href="/"><h7>Home</h7></a>
                    <div class="row index">
                        <a href="https://dicea.dev/#about"><h7>About Me</h7></a>
                        <a href="https://dicea.dev/posts/"><h7>Blog</h7></a>
                        <a href="https://dicea.dev/#projects"><h7>Projects</h7></a>
                        <a href="https://dicea.dev/#resume"><h7>Resume</h7></a>
                    </div>
                    <a href="javascript:void(0);" class="icon" onclick="myFunction()">
                        <i class="fa fa-bars"></i>
                    </a>
                </div>
            </nav>
        `;

        // Refresh the navigation links
        this.refreshNav();
    }

    refreshNav() {
        const currentURL = new URL(window.location.href);
        this.querySelectorAll("nav a").forEach(link => {
            const linkURL = new URL(link.href, currentURL.origin);

            // Mark as active if the link matches the current page
            if (currentURL.pathname === linkURL.pathname || currentURL.hash === linkURL.hash) {
                link.classList.add("current");
            } else {
                link.classList.remove("current");
            }
        });
    }
}

customElements.define('nav-component', Nav);
