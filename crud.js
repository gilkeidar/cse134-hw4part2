const g_selectors = {
    form: '#crud',
    fields: {
        select: '#crud-operation-field',
        name: '#project-name',
        img: '#project-img',
        alt: '#project-img-alt',
        description: '#project-description',
        link: '#project-page-link'
    }
};

const g_elements = {form: null, fields: {}};

const g_localStorageName = 'projects';

function init() {
    console.log('init');

    //  Populate data in localStorage
    const projectData = getProjectData();
    populateLocalData(projectData);

    //  Get form element
    g_elements.form = document.querySelector(g_selectors.form);

    //  Get form fields
    for (let field in g_selectors.fields) {
        g_elements.fields[field] = document.querySelector(g_selectors.fields[field]);
    }

    console.log(g_elements);

    //  Set legend name
    setActionLegend();

    //  Update form fields
    crudActionChange();

    //  Add Event listeners

    //  Add 'change' event listener to <select> tag
    g_elements.fields.select = document.querySelector(g_selectors.fields.select);
    g_elements.fields.select.addEventListener('change', crudActionChange);

    //  Enable submit button + add event listener
    const submitButton = document.querySelector('input[type="submit"]');
    submitButton.removeAttribute('disabled');

    g_elements.form.addEventListener('submit', formSubmit);
}

function getProjectData() {
    //  Return an array of objects to populate <project-card> tags

    //  A null value or an empty string should be ignored when rendering
    const data = {
        "data": [
            {
                "project-name": "ByteFrost",
                "img": "/assets/images/bytefrost-thumbnail-640_x_360.jpg",
                "alt": "ByteFrost, an 8 Bit Breadboard Computer",
                "description": "An ongoing project to build an 8 bit CPU using breadboards.",
                "href": "https://gil-keidar.netlify.app/projects/bytefrost"
            }
        ]
    }

    return data;
}

function populateLocalData(projectData) {
    if (!localStorage) {
        //  localStorage not found in this browser
        throw Error('populateLocalData: No localStorage found!');
    }

    //  Populate localStorage with projectData
    localStorage.setItem(g_localStorageName, JSON.stringify(projectData));
}

async function formSubmit(event) {
    event.preventDefault();

    //  Disable submit button
    const submitButton = document.querySelector('input[type="submit"]');
    submitButton.disabled = true;

    let formData = new FormData(g_elements.form);

    console.log(formData);
    console.log(formData.get('action'));

    if (formData.get('name') === '') {
        //  Throw error if name isn't given but is required (i.e., for first four options)
        throw Error('formSubmit: Project name must not be empty!');
    }

    switch(formData.get('action')) {
        case 'create':
            await createAction(formData);
            break;
        case 'read':
            await readAction(formData);
            break;
        case 'update':
            await updateAction(formData);
            break;
        case 'delete':
            await deleteAction(formData);
            break;
        case 'read-all':
            await readAll(formData);
            break;
        case 'delete-all':
            await deleteAll(formData);
            break;
    }

    //  Enable submit button
    submitButton.removeAttribute('disabled');
}

function crudActionChange() {
    //  Update legend name
    setActionLegend();

    //  Disable / enable fields based on selected action
    
    //  3 cases:
    //  Case 1: All fields enabled (for Create and Update)
    //  Case 2: Only name field enabled (for Read and Delete)
    //  Case 3: All fields disabled (for Read All and Delete All)
    
    //  Get action value
    const action = g_elements.fields.select.value;

    if (action == 'create' || action == 'update') {
        g_elements.fields.name.removeAttribute('disabled');
        g_elements.fields.img.removeAttribute('disabled');
        g_elements.fields.alt.removeAttribute('disabled');
        g_elements.fields.description.removeAttribute('disabled');
        g_elements.fields.link.removeAttribute('disabled');
    }
    else if (action == 'read' || action == 'delete') {
        g_elements.fields.name.removeAttribute('disabled');
        g_elements.fields.img.disabled = true;
        g_elements.fields.alt.disabled = true;
        g_elements.fields.description.disabled = true;
        g_elements.fields.link.disabled = true;
    }
    else {
        g_elements.fields.name.disabled = true;
        g_elements.fields.img.disabled = true;
        g_elements.fields.alt.disabled = true;
        g_elements.fields.description.disabled = true;
        g_elements.fields.link.disabled = true;
    }

}

function setActionLegend() {
    //  Get current value of #crud-operation-field
    const actionName = document.querySelector(g_selectors.fields.select).value;

    //  Get option element with this value
    const selectedOption = document.querySelector(`option[value="${actionName}"]`);

    //  Get fieldset legend
    const legend = document.querySelector('form > fieldset:last-of-type > legend');

    //  Set legend text
    legend.innerHTML = selectedOption.innerHTML;
}

//  Talk to remote server
async function remoteAction(action, sendData) {
    console.log('talk to server');

    let binID = '64cb012b8e4aa6225ec9ad14';

    let key = '$2b$10$AmKGpngTiOBRil5LHPbjnuDghlIZ7VApGvYP5WM1/CAwvRs5AFYLe';

    switch (action) {
        case 'read':
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

            console.log("data read from server:", data);

            //  Check that record property exists
            if (!data.record) {
                throw Error('getRemoteData: Invalid data retrieved from server!');
            }

            return data.record;
        case 'update':
            //  Update JSONBin.io data
            await fetch(`https://api.jsonbin.io/v3/b/${binID}`,
                {
                    method: 'PUT',
                    headers: {
                        'X-Master-Key': key,
                        'Content-Type': 'application/json'
                    },
                    body: sendData
                }
            )
            break;
    }
}

function resetOutput(val) {
    //  Find output tag
    const output = document.querySelector('output');

    //  Reset output
    output.innerHTML = val;

    return output;
}

function outputMessage(message) {
    //  Get output element
    const output = document.querySelector('output');

    output.innerHTML = message;
}

async function getData(isLocal) {
    if (isLocal) {
        //  Get data from localStorage
        outputMessage('Getting data from localStorage...');
        return JSON.parse(localStorage.getItem(g_localStorageName));
    }
    else {
        //  Get data from remote server
        outputMessage('Getting data from remote server...');
        return await remoteAction('read');
    }
}

async function writeData(isLocal, data) {
    //  Store projects data object array
    if (isLocal) {
        //  Store in localStorage
        outputMessage('Storing data in localStorage...');
        localStorage.setItem(g_localStorageName, JSON.stringify(data));
    }
    else {
        //  Store in remote server
        outputMessage('Storing data in remote server...');
        await remoteAction('update', JSON.stringify(data));
    }
}

function getProject(data, name) {
    if (data.data) {
        for (let project of data.data)
        {
            if (project['project-name'] === name)
            {
                return project;
            } 
        }
        return null;
    }
    else {
        throw Error('getProject: No project data array found!');
    }
}

function getProjectIndex(data, name) {
    if (data.data) {
        for (let i = 0; i < data.data.length; i++)
        {
            if (data.data[i]['project-name'] === name)
            {
                return i;
            } 
        }
        return -1;
    }
    else {
        throw Error('getProject: No project data array found!');
    }
}

function outputProject(project) {
    //  Find output tag
    const output = document.querySelector('output');

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
}

//  CRUD handlers

async function createAction(formData) {
    console.log('create');
    console.log(formData);

    //  Get projects JSON array
    let isLocal = formData.get('local-or-remote') == 'local';
    let data = await getData(isLocal);

    //  Create new projects data object
    let newProject = {
        "project-name": formData.get('name'),
        "img": formData.get('img'),
        "alt": formData.get('alt'),
        "description": formData.get('description'),
        "href": formData.get('href')
    };

    //  Add project to JSON array
    data.data.push(newProject);

    //  Store projects data object array
    await writeData(isLocal, data);

    outputMessage(`Successfully created project ${formData.get('name')}!`);
}

async function readAction(formData) {
    console.log('read');

    //  Get projects JSON array
    let isLocal = formData.get('local-or-remote') == 'local';
    let data = await getData(isLocal);

    //  Get specific project object
    let project = getProject(data, formData.get('name'));

    if (!project) {
        outputMessage(`Error: Didn't find a project with name ${formData.get('name')}!`);
    } else
    {
        //  Reset output
        const output = resetOutput('');
        //  Populate output tag with project-card
        outputProject(project);
    }
}

async function updateAction(formData) {
    console.log('update');

    //  Get projects JSON array
    let isLocal = formData.get('local-or-remote') == 'local';
    let data = await getData(isLocal);

    //  Get specific project object
    let project = getProject(data, formData.get('name'));
    
    if (!project) {
        outputMessage(`Error: Didn't find a project with name ${formData.get('name')}!`);
        return;
    }
    
    //  Create new projects data object
    let newProject = {
        "project-name": formData.get('name'),
        "img": formData.get('img'),
        "alt": formData.get('alt'),
        "description": formData.get('description'),
        "href": formData.get('href')
    };

    //  Update array
    data.data[getProjectIndex(data, formData.get('name'))] = newProject;

    //  Store projects data object array
    await writeData(isLocal, data);

    outputMessage(`Successfully updated project ${formData.get('name')}!`);
}

async function deleteAction(formData) {
    console.log('delete');

    //  Get projects JSON array
    let isLocal = formData.get('local-or-remote') == 'local';
    let data = await getData(isLocal);

    //  Get specific project object
    let project = getProject(data, formData.get('name'));
    
    if (!project) {
        outputMessage(`Error: Didn't find a project with name ${formData.get('name')}!`);
        return;
    }

    //  Delete project
    data.data.splice(getProjectIndex(data, formData.get('name')), 1);

    //  Store projects data object array
    await writeData(isLocal, data);

    outputMessage(`Successfully deleted project ${formData.get('name')}!`);
}

async function readAll(formData) {
    console.log('read all');

    //  Get projects JSON array
    let isLocal = formData.get('local-or-remote') == 'local';
    let data = await getData(isLocal);

    if (data.data) {
        if (data.data.length == 0) {
            outputMessage('No projects are currently stored.');
        }
        else {
            //  Reset output
            const output = resetOutput('');

            data.data.forEach(project => {
                outputProject(project);
            });
        }
    }
}

async function deleteAll(formData) {
    console.log('delete all');

    //  Get projects JSON array
    let isLocal = formData.get('local-or-remote') == 'local';
    let data = await getData(isLocal);

    data.data = [];

    //  Store projects data object array
    await writeData(isLocal, data);

    outputMessage(`Deleted all projects!`);
}

window.addEventListener('DOMContentLoaded', init);