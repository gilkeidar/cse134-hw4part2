function init() {
    console.log('init');

    //  Populate data in localStorage
    const projectData = getProjectData();
    populateLocalData(projectData);

    //  Get data from server (first time, but reload every time button
    //      is pressed)
    getRemoteData().then(data => {
        //  Loaded data from the server
        //  Find remote button, enable it, and add a click event listener
        const remoteButton = document.querySelector('#remote-button');
        remoteButton.removeAttribute('disabled');
        remoteButton.addEventListener('click', function() {
            remoteLoad(data, remoteButton);
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
            "project-name": "ByteFrost",
            "img": "/assets/images/bytefrost-thumbnail-640_x_360.jpg",
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

    let binID = '64cadee28e4aa6225ec99e90';

    let key = '$2b$10$AmKGpngTiOBRil5LHPbjnuDghlIZ7VApGvYP5WM1/CAwvRs5AFYLe';

    //  Fetch JSONBin.io data
    let data = await fetch(`https://api.jsonbin.io/v3/b/${binID}`,
        {
            method: 'GET',
            headers: {
                'X-Master-Key': key,
            }
        }
        ).then(response => {
            console.log(response);
            return response.json();
        });

    //  Check that record property exists
    if (!data.record) {
        throw Error('getRemoteData: Invalid data retrieved from server!');
    }

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

async function remoteLoad(projectData, remoteButton) {
    console.log('remote');
    console.log(remoteButton);

    //  If not first time press, then reload data from server
    if (remoteButton.hasAttribute('data-clicked')) {
        resetOutput("<p>Loading from JSONBin.io...</p>");
        projectData = await getRemoteData();
    }
    else {
        remoteButton.dataset.clicked = true;
    }

    outputProjects(projectData.data);
}

function resetOutput(val) {
    //  Find output tag
    const output = document.querySelector('output');

    //  Reset output
    output.innerHTML = val;

    return output;
}

function outputProjects(projectData) {
    console.log(projectData);
    
    //  Reset output
    const output = resetOutput('');

    projectData.forEach(project => {
        //  Create a new <project-card> element
        const projectCard = document.createElement('project-card');

        //  Set attributes
        for (let prop in project) {
            //  Skip property if value is null or empty string
            let attributeValue = project[prop];

            if (attributeValue) {
                // projectCard[prop] = attributeValue;
                projectCard.setAttribute(prop, attributeValue);
            }
        }

        //  Add project card to output
        output.appendChild(projectCard);
    });
}

window.addEventListener('DOMContentLoaded', init);

