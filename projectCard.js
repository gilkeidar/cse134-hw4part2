//  project-card custom element definition
// class ProjectCard extends HTMLElement {
//     constructor() {
//         //  Always call super() first in the constructor
//         super();

//         //  Attach the Shadow DOM to the web component
//         this.attachShadow({ mode: 'open' });

//         //  project-card element consists of:
//         //  <h2> tag    - project name
//         //  <img> tag   - project image w/alt text
//         //  <p> tag     - project description
//         //  <a> tag     - Read More link
//         //  <section>   - Skills used in the project
//         //      <h3>    - "Skills"
//         //      <ul>    - project list of skills used in the project

//         //  Create <h2> tag
//         const projectName = document.createElement('h2');
//         //  Set project name with attribute
//         projectName.innerText = this.hasAttribute('data-name')
//             ? this.getAttribute('data-name')
//             : 'Untitled Project';
        
//         //  Create <img> tag
//         const projectImage = document.createElement('img');
//         //  Set image source with attribute
//         projectImage.src = this.hasAttribute('img')
//             ? this.getAttribute('img')
//             : 'assets/images/default.png';
        
//         //  Set alt text with attribute
//         projectImage.alt = this.hasAttribute('alt')
//             ? this.getAttribute('alt')
//             : `Image of ${projectName.innerText}`;
        
//         //  Create <p> tag
//         const projectDescription = document.createElement('p');
//         //  Set project description with an attribute
//         projectDescription.innerText = this.hasAttribute('data-description')
//             ? this.getAttribute('data-description')
//             : `Project Description for ${projectName.innerText}`;

//         //  Create <a> tag
//         const readMore = document.createElement('a');
//         //  Set Read More link
//         readMore.innerText = 'Read More';
//         readMore.href = this.hasAttribute('href')
//             ? this.getAttribute('href')
//             : '';
        
//         //  Create Skill list section
//         // const skillSection = document.createElement('section');
//         // const skillHeading = document.createElement('h3');
//         // skillHeading.innerText = 'Skills';
//         // const skillList = document.createElement('ul');
//         // skill

//         //  Add linked styles
//         const linkedStyle = document.createElement('link');
//         linkedStyle.rel = 'stylesheet';
//         linkedStyle.href = 'projectCard.css';
//         linkedStyle.type = 'text/css';

//         //  Add styling (import)
//         // const style = document.createElement('style');
//         // style.innerText = '@import "/projectCard.css"';
        
//         //  Append tags to the Shadow DOM
//         this.shadowRoot.append(linkedStyle, projectName, 
//             projectImage, projectDescription, readMore);
//     }
// }

class ProjectCard extends HTMLElement {
    constructor() {
        //  Always call super() first in the constructor
        super();
        
        console.log("ProjectCard constructor");

        //  Attach the Shadow DOM to the web component
        this.attachShadow({ mode: 'open' });

        //  Get project-card template
        const template = document.querySelector('#project-card');

        //  Clone template
        const projectCard = template.content.cloneNode(true);

        //  project-card element consists of:
        //  <h2> tag    - project name
        //  <img> tag   - project image w/alt text
        //  <p> tag     - project description
        //  <a> tag     - Read More link

        //  Set <h2> tag (title)
        const projectName = projectCard.querySelector('h2');
        //  Set project name with attribute
        projectName.innerHTML = this.hasAttribute('data-name')
            ? this.getAttribute('data-name')
            : 'Untitled Project';
        
        //  Set <img> tag
        const projectImage = projectCard.querySelector('img');
        //  Set image source with attribute
        projectImage.src = this.hasAttribute('img')
            ? this.getAttribute('img')
            : '/assets/images/default-project.png';
        
        //  Set alt text with attribute
        projectImage.alt = this.hasAttribute('alt')
            ? this.getAttribute('alt')
            : `Image of ${projectName.innerHTML}`;
        
        //  Set <p> tag
        const projectDescription = projectCard.querySelector('p');
        //  Set project description with an attribute
        projectDescription.innerHTML = this.hasAttribute('data-description')
            ? this.getAttribute('data-description')
            : `Project Description for ${projectName.innerHTML}`;

        //  Set <a> tag
        const readMore = projectCard.querySelector('a');
        //  Set Read More link
        readMore.innerHTML = 'Read More';
        readMore.href = this.hasAttribute('href')
            ? this.getAttribute('href')
            : '';

        //  Append projectCard to the Shadow DOM
        this.shadowRoot.appendChild(projectCard);
    }

    // static get observedAttributes() {
    //     return ['data-name', 'img', 'alt', 'data-description', 'href']
    // }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     console.log("ProjectCard attributeChangedCallback");
    //     console.log(name);
    //     console.log(oldValue);
    //     console.log(newValue);
    // }
}

//  Define new custom element
customElements.define('project-card', ProjectCard);