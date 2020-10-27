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
                    <a class="nav-link text-white" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white" href="#">Link</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link text-white dropdown-toggle" href="#" id="navbarDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
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

function queryDBAndSetUpUserStoriesFeed(appender) {
    if(appender != null) {
        // This will need to be updated to match your backend. I'm going to fetch my fake json data to similate an async request to the database
        fetch('./javascript/fake-data.json')
  .then(response => response.json())
  .then(data => console.log(data));
    };
};

// EVENTS 
// Event Delegation for dynamic elements in the forms
function setupEventDelegationForNews(element) {
    if(element !== null) {
        element.addEventListener("click", (e) => {
            // Adding paragraph 
            if(e.target && e.target.matches("#add-paragraph")) {
                e.stopPropagation();
                renderAdditionalParagraph(document.querySelector('#story-paragraphs'))
            };
            // Removing paragraph
            if(e.target && e.target.matches(".remove-paragraph")) {
                e.stopPropagation();
                e.target.closest('.paragraph').remove();
                const paragraphs = document.querySelectorAll('.paragraph');
                for(let i = 0; i < paragraphs.length; i++) {
                    paragraphs[i].querySelector('label').setAttribute('for', `paragraph-${(i+1)}`);
                    paragraphs[i].querySelector('label').innerText = `Paragraph ${(i+1)}`;
                    paragraphs[i].querySelector('textarea').setAttribute('id', `paragraph-${(i+1)}`);
                }
            };
            // Adding art 
            if(e.target && e.target.matches('#add-art')) {
                e.stopPropagation();
                renderAdditionalArt(document.querySelector('#story-art'));
            };
            // Removing art
            if(e.target && e.target.matches('.remove-art')) {
                e.stopPropagation();
                e.target.closest('.art').remove();
                const arts = document.querySelectorAll('.art');
                for(let i = 0; i < arts.length; i++) {
                    arts[i].querySelector('label.image').setAttribute('for', `image-${(i+1)}`);
                    arts[i].querySelector('label.image').innerText = `Image ${(i+1)}`;
                    arts[i].querySelector('input.image').setAttribute('id', `image-${(i+1)}`);

                    arts[i].querySelector('label.caption').setAttribute('for', `caption-${(i+1)}`);
                    arts[i].querySelector('label.caption').innerText = `Caption ${(i+1)}`;
                    arts[i].querySelector('input.caption').setAttribute('id', `caption-${(i+1)}`);
                }
            }
        })
    };
};

// News item Submission
function submitNewNewsItem(formElement) {
    if(formElement !== null) {
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let tags = [];
            let paragraphs = [];
            let arts = [];
            const newsItem = {};
            newsItem.title = formElement['title'].value;
            newsItem.author = formElement['author'].value;
            newsItem.publishDate = formElement['publish-date'].value;
            newsItem.contact = formElement['contact'].value;
            newsItem.thumbnailImage = formElement['thumbnail-image'].value;

            // figure out tags array
            const allPotentialTags = document.querySelectorAll('.tags[type="checkbox"]');
            allPotentialTags.forEach(tag => {
                if(tag.checked){
                    tags.push(tag.value);
                }
            });
            newsItem.tags = tags;

            // figure out all of the stories paragraphs
            const allParagraphs = document.querySelectorAll('.paragraph');
            allParagraphs.forEach(paragraphElement => {
                paragraphs.push(paragraphElement.querySelector('textarea').value);
            });
            newsItem.paragraphs = paragraphs;

            // figure out all of the art that the story has
            const allArts = document.querySelectorAll('.art');
            allArts.forEach(art => {
                arts.push({image: art.querySelector('input.image').value, caption: art.querySelector('input.caption').value})
            });
            newsItem.arts = arts;

            // Here is where you would submit the object to the database.
            console.log(newsItem);

            // UI feedback stuff
            formElement.reset();
            formElement.classList.add('d-none');
            document.querySelector('#success-notification').classList.remove('d-none');
            setTimeout(() => {
                formElement.classList.remove('d-none');
                document.querySelector('#success-notification').classList.add('d-none');
            }, 3000);
        })
    };
};

// HTML TEMPLATES
// paragraph
function renderAdditionalParagraph(appender) {
    const currentParagraphCount = document.querySelectorAll('.paragraph').length;
    const htmlTemplate = `
    <div class="card mb-3 paragraph">
        <div class="card-body">
            <div class="form-group">
                <button type="button" class="float-right btn btn-danger my-1 remove-paragraph">Remove Paragraph</button>
                <label class="font-weight-bold" for="paragraph-${(currentParagraphCount + 1)}">Paragraph ${(currentParagraphCount + 1)}</label>
                <textarea class="form-control" id="paragraph-${(currentParagraphCount + 1)}" rows="3" required="required"></textarea>
            </div>
        </div>
    </div>
`;
    appender.innerHTML += htmlTemplate;
};
// art
function renderAdditionalArt(appender) {
    const currentArtItemsCount = document.querySelectorAll('.art').length;
    const htmlTemplate = `
    <div class="card mb-3 art">
        <div class="card-body">
            <div class="form-group">
                <button type="button" class="float-right btn btn-danger my-1 remove-art">Remove Art</button>
                <label class="font-weight-bold image" for="image-${(currentArtItemsCount + 1)}">Image ${(currentArtItemsCount + 1)}</label>
                <input type="text" class="form-control image" id="image-${(currentArtItemsCount + 1)}" required="required" />
            </div>
            <div class="form-group">
                <label class="font-weight-bold caption" for="caption-${(currentArtItemsCount + 1)}">Caption ${(currentArtItemsCount + 1)}</label>
                <input type="text" class="form-control caption" id="caption-${(currentArtItemsCount + 1)}" required="required" />
            </div>
        </div>
    </div>
  </div>
    `;
    appender.innerHTML += htmlTemplate;
};

// story feed template
function renderStoryInFeed(data, appender) {
    const htmlTemplate = `

    `;
    appender.innerHTML += htmlTemplate;
}


//
window.addEventListener("DOMContentLoaded", () => {
    // set up the top navigation menu component 
    window.customElements.define('top-navigation-menu', topNavigationMenu);
    // set up event delegation on the whole document
    setupEventDelegationForNews(document);
    // set up the form submission for adding new News items
    submitNewNewsItem(document.querySelector('#create-news-story-form'));
    // set up the news feed for regular users
    queryDBAndSetUpUserStoriesFeed(document.querySelector('#stories'));
});