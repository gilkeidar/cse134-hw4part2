//  project-card custom element definition

class ProjectCard extends HTMLElement {

    #shadow;

    constructor() {
        //  Always call super() first in the constructor
        super();

        console.log('ProjectCard constructor()');

        //  Attach the Shadow DOM to the web component
        this.#shadow = this.attachShadow({ mode: 'open' });

        //  Get project-card template
        const template = document.querySelector('#project-card');

        //  Clone template
        const projectCard = template.content.cloneNode(true);

        //  project-card element consists of:
        //  <h2> tag    - project name
        //  <img> tag   - project image w/alt text
        //  <p> tag     - project description
        //  <a> tag     - Read More link

        //  Append projectCard to the Shadow DOM
        this.shadowRoot.appendChild(projectCard);

        //  Set tags

        //  Set <h2> tag (title)
        this.updateProjectName();

        //  Set <img> tag
        this.updateImageSource();
        this.updateImageAlt();

        //  Set <p> tag
        this.updateDescription();

        //  Set <a> tag
        const readMore = this.#shadow.querySelector('a');
        readMore.innerHTML = 'Read More';
        this.updateLink();
    }

    static get observedAttributes() {
        return ['project-name', 'img', 'alt', 'description', 'href'];
    }

    //  project-name
    updateProjectName() {
        this.projectName = this.hasAttribute('project-name')
            ? this.projectName
            : 'Untitled Project';
    }

    get projectName() {
        return this.hasAttribute('project-name')
            ? this.getAttribute('project-name')
            : this.#shadow.querySelector('h2').innerHTML;
    }

    set projectName(val) {
        //  Find <h2> tag
        const h2 = this.#shadow.querySelector('h2');

        h2.innerHTML = val;
    }

    //  img

    updateImageSource() {
        this.img = this.hasAttribute('img')
            ? this.img
            : '/assets/images/default-project.png';
    }

    get img() {
        return this.getAttribute('img');
    }

    set img(val) {
        //  Find <img> tag
        const img = this.#shadow.querySelector('img');

        //  Set img src
        img.src = val;
    }

    //  alt

    updateImageAlt() {
        this.alt = this.hasAttribute('alt')
            ? this.alt
            : `Image of ${this.projectName}`;
    }

    get alt() {
        return this.getAttribute('alt');
    }

    set alt(val) {
        //  Find <img> tag
        const img = this.#shadow.querySelector('img');

        //  Set img alt
        img.alt = val;
    }

    //  description

    updateDescription() {
        this.description = this.hasAttribute('description')
            ? this.description
            : `Project Description for ${this.projectName}`;
    }

    get description() {
        return this.getAttribute('description');
    }

    set description(val) {
        //  Find <p> tag
        const p = this.#shadow.querySelector('p');

        //  Set description
        p.innerHTML = val;
    }

    //  href

    updateLink() {
        this.href = this.hasAttribute('href')
            ? this.href
            : '';
    }

    get href() {
        return this.getAttribute('href');
    }

    set href(val) {
        //  Find <a> tag
        const a = this.#shadow.querySelector('a');

        //  Set link
        a.href = val;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('ProjectCard attributeChangedCallback');

        if (oldValue != newValue)
        {
            console.log(`attribute: ${name} | oldValue: ${oldValue} | newValue: ${newValue}`);

            switch (name) {
                case 'project-name':
                    this.updateProjectName();
                    break;
                case 'img':
                    this.updateImageSource();
                    break;
                case 'alt':
                    this.updateImageAlt();
                    break;
                case 'description':
                    this.updateDescription();
                    break;
                case 'href':
                    this.updateLink();
                    break;
            }
        }
    }
}


//  Define new custom element
customElements.define('project-card', ProjectCard);