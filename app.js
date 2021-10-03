// Use the user's selection
  // field.selectionStart and field.selectionEnd ^
  // add opening and closing tags at start and end

const markdownInputArr = [...document.getElementsByClassName("markdown-input")] // without the spread operator, this returns an htmlCollection
const markdownInput = markdownInputArr[0]
const editorButtonsArr = [...document.getElementsByClassName('editor-button')]
const renderedMarkdownSection = document.getElementById('rendered-markdown')

let selectedCoordinates = null
let selectedText = ""


// On Input Change
markdownInput.addEventListener('input', (e) => {
  markdownInput.value = e.target.value

  renderedMarkdownSection.innerHTML = marked(markdownInput.value)
}, false)


// On Selection
markdownInput.addEventListener('select', (e) => {
  selectedCoordinates = {
    start: e.target.selectionStart,
    end: e.target.selectionEnd
  }

  selectedText = e.target.value.slice(selectedCoordinates.start, selectedCoordinates.end)
}, false)

function addTags(openingTag, closingTag) {
  markdownInput.value = markdownInput.value.slice(0, selectedCoordinates.start) 
  + openingTag 
  + selectedText
  + closingTag
  + markdownInput.value.slice(selectedCoordinates.end) 
}


function handleEditorButtonClick(type) {

  console.log(type)
  switch(type) {
    case 'h1' : {
      addTags('# ', '')
      break;
    }
    case 'h2' : {
      addTags('## ', '')
      break;
    }
    case 'h3' : {
      addTags('### ', '')
      break;
    }
    case 'h4' : {
      addTags('#### ', '')
      break;
    }
    case 'h5' : {
      addTags('##### ', '')
      break;
    }
    case 'h6' : {
      addTags('###### ', '')
      break;
    }
    case 'bold' : {
      addTags('**', '**')
      break;
    }
    case 'italic' : {
      addTags('<i>', '</i>')
      break;
    }
    case 'underline' : {
      addTags('<u>', '</u>')
      break;
    }
    default: return 
  }

  renderedMarkdownSection.innerHTML = marked(markdownInput.value)

}

// On Editor Button Click
for(let i = 0; i < editorButtonsArr.length; i++) {
    editorButtonsArr[i].addEventListener('click', (e) => {

    const buttonType = e.target.getAttribute('id').replace('button-', '')
    console.log(buttonType)

    if(selectedCoordinates) {
      handleEditorButtonClick(buttonType, selectedCoordinates)
    } else {
      return 
    }

    selectedCoordinates = null
  }, false)
} 




// Add edit history timeline 

// For view only
// Render markdown result after each change in the input (marked package)
  // Use highlight.js to also render code related tags
    // Give user a selection of the different code syntax options
    // Add line breaks and curly brackets around code snippet