function init() {
    console.log('init');

    //  Populate data in localStorage
    const projectData = getProjectData();
    populateLocalData(projectData);

    //  Get data from server
    getRemoteData().then(data => {
        //  Loaded data from the server
        //  Find remote button, enable it, and add a click event listener
        const remoteButton = document.querySelector('#remote-button');
        remoteButton.removeAttribute('disabled');
        remoteButton.addEventListener('click', function() {
            remoteLoad(data);
        })
    })

    //  Enable local load button and add a click event listener
    const localButton = document.querySelector('#local-button');   
    localButton.removeAttribute('disabled');
    localButton.addEventListener('click', localLoad);
}

function getProjectData() {
    //  Return an array of objects to populate <project-card> tags

    //  A null value or an empty string should be ignored when rendering
    const data = [
        {
            "name": "ByteFrost",
            "img": null,
            "alt": "ByteFrost, an 8 Bit Breadboard Computer",
            "description": "An ongoing project to build an 8 bit CPU using breadboards.",
            "href": null
        }
    ]

    return data;
}

function populateLocalData(projectData) {
    if (!localStorage) {
        //  localStorage not found in this browser
        throw Error('populateLocalData: No localStorage found!');
    }

    //  Populate localStorage with projectData
    localStorage.setItem('projects', JSON.stringify(projectData));
}

async function getRemoteData() {
    console.log('populate remote data');

    let binID = '64c9a3779d312622a38a426c';

    //  Fetch JSONBin.io data
    let data = await fetch(`https://api.jsonbin.io/v3/b/${binID}`).then(response => {
        console.log(response);
        return response.json();
    });

    //  TODO: Possibly refactor this to be safer? i.e. check that record prop exists
    return data.record;
}

function localLoad() {
    console.log('local');

    if (!localStorage) {
        //  localStorage not found in this browser
        throw Error('localLoad: No localStorage found!');
    }

    //  Get localStorage data
    const data = JSON.parse(localStorage.getItem('projects'));

    outputProjects(data);
}

function remoteLoad(projectData) {
    console.log('remote');

    outputProjects(projectData.data);
}

function outputProjects(projectData) {
    console.log(projectData);
    //  Find output tag
    const output = document.querySelector('output');

    let projectsHTML = '';

    projectData.forEach(project => {
        //  Add starting tag
        projectsHTML += '<project-card';

        //  Set attributes
        for (let prop in project) {
            //  Skip property if value is null or empty string
            let attributeValue = project[prop];

            if (attributeValue) {      
                //  Add data- prefix for name and description attributes
                if (prop == 'name' || prop == 'description') {
                    prop = 'data-' + prop;
                }
                projectsHTML += ` ${prop}="${attributeValue}"`;
            } 
        }

        projectsHTML += '></project-card>';

        console.log(projectsHTML);
    });

    output.innerHTML = projectsHTML;
}

window.addEventListener('DOMContentLoaded', init);

