// Component for Top Nav
class topNavigationMenu extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-primary">
        <a class="navbar-brand text-white" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link text-white" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                
                <li class="nav-item">
                    <a class="nav-link text-white" href="/regular-news/view-all-stories.html">View All Stories</a>
                </li>

                
                <li class="nav-item dropdown">
                    <a class="nav-link text-white dropdown-toggle" href="#" id="navbarDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Admin things
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="/regular-news/add-story.html">Add Story</a>
                        <a class="dropdown-item" href="/regular-news/admin-view-all-stories.html">Admin View All Stories</a>
                        <div class="dropdown-divider"></div>
                        <!-- <a class="dropdown-item" href="#">Something else here</a> -->
                    </div>
                </li>

                <li class="nav-item">
                    <a class="nav-link text-white" href="/build-a-story/build-a-story.html">Build a Story</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white" href="/build-a-story/view-build-a-story-story.html">View a Build a Story</a>
                </li>
                
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn text-white btn-outline-dark my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>
    </nav>
        `;
    }
};

// Render a Build a story story
function queryDBAndSetUpBuildAStory(appender, urlParameter) {
    if (appender !== null) {
        fetch('./javascript/fake-build-a-story.json')
            .then(response => response.json())
            .then(docs => {
                docs.forEach(doc => {
                    const regex = /\s/gi;
                    const cleanTitle = doc.title.trim().replace(regex, '-').toLowerCase();
                    if (cleanTitle === urlParameter) {
                        renderBuildAStory(doc, appender);
                    };
                })
            })
            .catch(err => console.error(err));
    }
};

function renderBuildAStory(data, appender) {
    let sectionTemplate = ``;

    data.sections.forEach(section => {
        sectionTemplate += `
        <div class="row">
            <div class="col-12">
            ${(section.title.trim() != '') ? `<h2>${section.title.trim()}</h2>` : ``}
        `;
        const numberOfItemsInSection = Object.keys(section).length - 1;
        for (let i = 0; i < numberOfItemsInSection; i++) {
            if (section[`item${i}`].itemType == 'paragraph') {
                sectionTemplate += `
                <p>${section[`item${i}`].paragraph}</p>
                `;
            } else if (section[`item${i}`].itemType == 'list') {
                sectionTemplate += `<ul>`;
                section[`item${i}`].list.forEach(listItem => {
                    sectionTemplate += `<li>${listItem}</li>`;
                })
                sectionTemplate += `</ul>`;
            } else if (section[`item${i}`].itemType == 'image') {
                let floatSide = '';
                if (section[`item${i}`].alignment === 'Left') {
                    floatSide = 'float-left'
                } else {
                    floatSide = 'float-right'
                }
                let width = '';
                switch (section[`item${i}`].width) {
                    case '25%':
                        width = 'col-md-3';
                        break;
                    case '33%':
                        width = 'col-md-4';
                        break;
                    case '50%':
                        width = 'col-md-6';
                        break;
                    case '66%':
                        width = 'col-md-8';
                        break;
                    case '75%':
                        width = 'col-md-9';
                        break;
                    case '100%':
                        width = 'col-md-12';
                        break;
                }
                sectionTemplate += `
                    <div class="${floatSide} ${width}">
                        <img class="w-100" src="${section[`item${i}`].imageURL}" alt="${section[`item${i}`].description}" />
                    </div>
                `;
            } else {
                'I do not know'
            }
        };
        sectionTemplate += `
            </div>
        </div>
        `;
    })

    const htmlTemplate = `
<div class="row">
    <div class="col-12">  
        <h1>${data.title}</h1>
        <div class="row justify-content-end">
            <div class="col-sm-12 col-md-3">
                <p class="h5">${data.publishDate}</p>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        ${sectionTemplate}
    </div>
    <div class="col-12">
        <p class="text-center">###</p>
        <p><span class="font-weight-bold">Writer(s)</span>: ${data.author}</p>
    </div>
</div>
    `;

    appender.innerHTML = htmlTemplate;

};

// Event Delegation for dynamic elements in the forms
// ToDo:// add the rest of the removing of things functionality.
function setupEventDelegationForBuildAStory(element) {
    if (element !== null) {
        element.addEventListener("click", (e) => {
            // Adding new sections
            if (e.target && e.target.matches('#add-section')) {
                e.stopPropagation();
                renderBuildASection(document.querySelector('#sections'));
            };
            // Removing sections
            if (e.target && e.target.matches('.delete-section')) {
                e.stopPropagation();
                e.target.closest('.section').remove();
                const sections = document.querySelectorAll('.section');
                for (let i = 0; i < sections.length; i++) {
                    // sections[i].querySelector('label').setAttribute('for', `paragraph-${(i + 1)}`);
                    // sections[i].querySelector('label').innerText = `Paragraph ${(i + 1)}`;
                    // sections[i].querySelector('textarea').setAttribute('id', `paragraph-${(i + 1)}`);
                };
                // ToDo:// need to update everything downstream too... 
            };
            // Adding paragraph within a section
            if (e.target && e.target.matches(".add-paragraph")) {
                e.stopPropagation();
                const currentSectionNumber = e.target.closest('.section').querySelector('div').getAttribute('id').split('-')[1];
                renderBuildAParagraph(e.target.closest('.section').querySelector('div'), currentSectionNumber)
            };
            // Removing a paragraph within a section when building a story
            if (e.target && e.target.matches(".remove-paragraph")) {
                e.stopPropagation();
                const currentSection = e.target.closest('.section');
                const currentSectionNumber = currentSection.querySelector('div').getAttribute('id').split('-')[1];
                e.target.closest('.paragraph').remove();
                const paragraphs = currentSection.querySelectorAll('.paragraph');
                for (let i = 0; i < paragraphs.length; i++) {
                    paragraphs[i].querySelector('label').setAttribute('for', `section-${currentSectionNumber}-paragraph-${i}`);
                    paragraphs[i].querySelector('textarea').setAttribute('id', `section-${currentSectionNumber}-paragraph-${i}`);
                }
            };
            // Adding list when building a story 
            if (e.target && e.target.matches('.add-list')) {
                e.stopPropagation();
                const currentSectionNumber = e.target.closest('.section').querySelector('div').getAttribute('id').split('-')[1];
                renderBuildAList(e.target.closest('.section').querySelector('div'), currentSectionNumber);
            };
            // Remove a whole list all at once.
            if (e.target && e.target.matches(".remove-list")) {
                e.stopPropagation();
                const currentSection = e.target.closest('.section');
                const currentSectionNumber = currentSection.querySelector('div').getAttribute('id').split('-')[1];
                e.target.closest('.list').remove();
                // ToDo:// lists need to be made more uniquely identifiable
            }
            // Adding list items.
            if (e.target && e.target.matches('.add-list-item')) {
                e.stopPropagation();
                renderAdditionalListItem(e.target.closest('.item').querySelector('.list-items'));
            };
            // Remove individual list items 
            if (e.target && e.target.matches(".delete-list-item")) {
                e.stopPropagation();
                const currentSection = e.target.closest('.section');
                const currentSectionNumber = currentSection.querySelector('div').getAttribute('id').split('-')[1];
                e.target.closest('.list-item').remove();
                // ToDo:// need to re-order the things.
            }
            // Adding image when building a story 
            if (e.target && e.target.matches('.add-image')) {
                e.stopPropagation();
                const currentSectionNumber = e.target.closest('.section').querySelector('div').getAttribute('id').split('-')[1];
                renderBuildAnImage(e.target.closest('.section').querySelector('div'), currentSectionNumber)
            };
            // Removing image when building a story 
            if (e.target && e.target.matches('.remove-image')) {
                e.stopPropagation();
                const currentSection = e.target.closest('.section');
                const currentSectionNumber = currentSection.querySelector('div').getAttribute('id').split('-')[1];
                e.target.closest('.image').remove();
                const images = currentSection.querySelectorAll('.item');
                for (let i = 0; i < images.length; i++) {
                    images[i].querySelector('label.image-label').setAttribute('for', `section-${currentSectionNumber}-image-${i}`);
                    images[i].querySelector('input.image-url').setAttribute('id', `section-${currentSectionNumber}-image-${i}`);

                    images[i].querySelector('label.description-label').setAttribute('for', `section-${currentSectionNumber}-image-${i}-description`);
                    images[i].querySelector('input.image-description').setAttribute('id', `section-${currentSectionNumber}-image-${i}-description`);

                    images[i].querySelector('label.width-label').setAttribute('for', `section-${currentSectionNumber}-image-${i}-width`);
                    images[i].querySelector('select.image-width').setAttribute('id', `section-${currentSectionNumber}-image-${i}-width`);

                    images[i].querySelector('label.alignment-label').setAttribute('for', `section-${currentSectionNumber}-image-${i}-alignment`);
                    images[i].querySelector('select.image-alignment').setAttribute('id', `section-${currentSectionNumber}-image-${i}-alignment`);
                }
            }
        })
    };
};
// Submit a built story
function submitBuildAStory(formElement) {
    if (formElement != null) {
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let items = [];
            const buildAStory = {};
            buildAStory.title = formElement['title'].value;
            buildAStory.author = formElement['author'].value;
            buildAStory.publishDate = formElement['publish-date'].value;
            buildAStory.thumbnailImage = formElement['thumbnail-image'].value;

            // sections 1) how many sections. 2) items in each section 3) keeping the order and getting each item in the section
            const numberOfSections = document.querySelector('#sections').querySelectorAll('.section');
            for (let currentSection = 0; currentSection < numberOfSections.length; currentSection++) {
                const numberOfItemsInSection = numberOfSections[currentSection].querySelectorAll('.item');
                const section = {};
                section.title = formElement[`section-${currentSection}-title`].value;
                if (numberOfItemsInSection.length > 0) {
                    for (let item = 0; item < numberOfItemsInSection.length; item++) {
                        if (numberOfItemsInSection[item].classList.contains('paragraph')) {
                            section[`item${item}`] = {
                                itemType: 'paragraph',
                                paragraph: numberOfItemsInSection[item].querySelector('textarea').value
                            };
                        } else if (numberOfItemsInSection[item].classList.contains('list')) {
                            let currentListArray = [];
                            let currentList = numberOfItemsInSection[item].querySelectorAll('.list-item');
                            currentList.forEach(listItem => {
                                currentListArray.push(listItem.querySelector('input').value);
                            })
                            section[`item${item}`] = {
                                itemType: 'list',
                                list: currentListArray
                            };
                        } else if (numberOfItemsInSection[item].classList.contains('image')) {
                            section[`item${item}`] = {
                                itemType: 'image',
                                imageURL: numberOfItemsInSection[item].querySelector('.image-url').value,
                                description: numberOfItemsInSection[item].querySelector('.image-description').value,
                                width: numberOfItemsInSection[item].querySelector('.image-width').value,
                                alignment: numberOfItemsInSection[item].querySelector('.image-alignment').value,
                            };
                        } else {
                            section[`item${item}`] = {
                                itemType: 'impossible',
                                string: 'Something previously believe to be impossible has happened. -Good Luck.'
                            }
                        }
                    };
                }
                items.push(section);
            };

            buildAStory.sections = items;
            // Here is where you would save the object to a database.
            console.log(buildAStory);
            // Print the json as a string to the DOM
            document.querySelector('#output').innerText = JSON.stringify(buildAStory);


            // UI feedback stuff
            //  formElement.reset();
            //  formElement.classList.add('d-none');
            //  document.querySelector('#success-notification').classList.remove('d-none');
            //  setTimeout(() => {
            //      formElement.classList.remove('d-none');
            //      document.querySelector('#success-notification').classList.add('d-none');
            //  }, 3000);
        })
    };
};
// HTML Templates
// html template to add a new section when building a story
function renderBuildASection(appender) {
    const numberOfSections = document.querySelectorAll('.section').length;
    const htmlTemplate = `
    <div class="section border p-3 mb-3">
    <div id="section-${numberOfSections}">
        <h3>Section ${numberOfSections}</h3>
        <div class="row justify-content-end">
            <div class="col-12 col-sm-4">
                <button type="button" class="btn btn-danger btn-block delete-section">Delete Section</button>
            </div>
        </div>
        <div class="my-3">
            <label class="font-weight-bold" for="section-${numberOfSections}-title">Title</label>
            <input class="form-control" id="section-${numberOfSections}-title" required="required" />
        </div>
    </div>
    <div class="row">
        <div class="col-12 col-sm-4"><button type="button" class="btn btn-success btn-block add-paragraph">+ Add a Paragraph</button></div>
        <div class="col-12 col-sm-4"><button type="button" class="btn btn-success btn-block add-list">+ Add a list</button></div> 
        <div class="col-12 col-sm-4"><button type="button" class="btn btn-success btn-block add-image">+ Add an image</button></div>
    </div>
</div>
    `;
    appender.innerHTML += htmlTemplate;
};
// html template for another paragraph when building a story
function renderBuildAParagraph(appender, sectionNumber) {
    const paragraphNumber = appender.querySelectorAll('.paragraph').length;
    const htmlTemplate = `
    <div class="card mb-3 item paragraph">
        <div class="card-body">
            <div class="form-group">
                <button type="button" class="float-right btn btn-danger my-1 remove-paragraph">Remove Paragraph</button>
                <label class="font-weight-bold" for="section-${sectionNumber}-paragraph-${paragraphNumber}">Paragraph</label>
                <textarea class="form-control" id="section-${sectionNumber}-paragraph-${paragraphNumber}" rows="3" required="required"></textarea>
            </div>
        </div>
    </div>
`;
    appender.innerHTML += htmlTemplate;
};
// html template for another list when building a story
function renderBuildAList(appender, sectionNumber) {
    const itemNumber = appender.querySelectorAll('.item').length;
    const htmlTemplate = `
    <div class="card mb-3 item list">
    <div class="card-body">
        <div class="form-group">
            <div class="mb-5">
                <button type="button" class="float-left btn btn-success my-1 add-list-item">Add List Item</button>
                <button type="button" class="float-right btn btn-danger my-1 remove-list">Remove List</button>
                <div class="clearfix"></div>
                <p class="font-weight-bold">List</p>
            </div>
            <div class="list-items">
            </div>
        </div>
    </div>
</div>
    `;
    appender.innerHTML += htmlTemplate;

};
// html template for adding individual list items when building a story
function renderAdditionalListItem(appender) {
    const numberOfListItems = appender.querySelectorAll('.list-item').length;
    const htmlTemplate = `
    <div class="list-item form-row mb-1">
        <label class="col-sm-2 font-weight-bold" for="list-item-${numberOfListItems}">List Item ${numberOfListItems}</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" id="list-item-${numberOfListItems}" required="required" />
        </div>
        <div class="col-sm-2">
            <button class="btn btn-danger btn-sm float-right delete-list-item">Delete List Item</button>
        </div>
    </div>
    `;
    appender.innerHTML += htmlTemplate;
};
// html template for adding another image when building a story
function renderBuildAnImage(appender, sectionNumber) {
    const imageNumber = appender.querySelectorAll('.image').length;
    const htmlTemplate = `
    <div class="card mb-3 item image">
        <div class="card-body">
            <div class="form-group">
                <button type="button" class="float-right btn btn-danger my-1 remove-image">Remove Image</button>
                <label class="font-weight-bold image-label" for="section-${sectionNumber}-image-${imageNumber}">Image URL</label>
                <input class="form-control image-url" id="section-${sectionNumber}-image-${imageNumber}" required="required" />

                <label class="font-weight-bold description-label" for="section-${sectionNumber}-image-${imageNumber}-description">Image Description</label>
                <input class="form-control image-description" id="section-${sectionNumber}-image-${imageNumber}-description" required="required" />

                <label class="font-weight-bold width-label" for="section-${sectionNumber}-image-${imageNumber}-width">Image Width</label>
                <select class="form-control image-width" id="section-${sectionNumber}-image-${imageNumber}-width" required="required" >
                    <option value="">Please select a width</option>
                    <option value="25%">25%</option>
                    <option value="33%">33%</option>
                    <option value="50%">50%</option>
                    <option value="66%">66%</option>
                    <option value="75%">75%</option>
                    <option value="100%">100%</option>
                </select>

                <label class="font-weight-bold alignment-label" for="section-${sectionNumber}-image-${imageNumber}-alignment">Image Aligment</label>
                <select class="form-control image-alignment" id="section-${sectionNumber}-image-${imageNumber}-alignment" required="required" >
                    <option value="">Please select aligment</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                </select>
            </div>
        </div>
    </div>
`;
    appender.innerHTML += htmlTemplate;
};

// things to do in the browser
window.addEventListener("DOMContentLoaded", () => {
    // set up the top navigation menu component 
    window.customElements.define('top-navigation-menu', topNavigationMenu);
    // event listner
    setupEventDelegationForBuildAStory(document.querySelector('#build-a-story-form'))
    // submit build a story
    submitBuildAStory(document.querySelector('#build-a-story-form'));
    // set up a story 
    queryDBAndSetUpBuildAStory(document.querySelector('#view-build-a-story'), document.URL.split('?')[1])
});