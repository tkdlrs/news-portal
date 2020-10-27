// Event Delegation for dynamic elements in the form
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
            const newsItem = {};
            newsItem.title = formElement['#title'].value;
        })
    };
};

// HTML Templates
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
}

//
window.addEventListener("DOMContentLoaded", () => {
    setupEventDelegationForNews(document);
});