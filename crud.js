function init() {
    console.log('init');
    
    //  Get form element
    const form = document.querySelector('#crud');

    //  Set legend name
    // updateCRUDLegendName(document.querySelector('#crud-operation-field').value);
    crudActionChange(document.querySelector('#crud-operation-field').value);
    //  Simulate sending an event (hacky)
    // crudActionChange({
    //     target: {
    //         value: document.querySelector('#crud-operation-field').value
    //     }
    // });

    //  Add event listener to select field
    const crudAction = document.querySelector('#crud-operation-field');
    crudAction.addEventListener('change', (e) => {crudActionChange(e.target.value);});

    //  Enable submit button
    const submitButton = document.querySelector('input[type="submit"]');
    submitButton.removeAttribute('disabled');

    //  Add event listener for form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formSubmit(form);
    });
}

function formSubmit(form) {

    let formData = new FormData(form);
    console.log(formData);

    formData = null;
}

function crudActionChange(action) {
    //  Update legend name
    updateCRUDLegendName(action);

    //  Disable / enable fields based on action
    const imgField = document.querySelector('#project-img');
    const altField = document.querySelector('#project-img-alt');
    const descriptionField = document.querySelector('#project-description');
    const linkField = document.querySelector('#project-page-link');

    //  TODO: - may be "poking" the DOM too much - consider using a DOM Fragment
    imgField.disabled
    = altField.disabled
    = descriptionField.disabled
    = linkField.disabled
    = (action == 'read' || action == 'delete');
        
}

function updateCRUDLegendName(newName) {
    //  Update fieldset legend
    const legend = document.querySelector('form > fieldset:last-of-type > legend');
    //  Get first character of action name and switch to upper case
    let legendValue = newName.charAt(0).toUpperCase();
    //  Append the rest of the action name
    legendValue += newName.substring(1);
    legend.innerHTML = legendValue;
}

window.addEventListener('DOMContentLoaded', init);