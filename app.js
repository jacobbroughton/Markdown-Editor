// Use the user's selection
  // field.selectionStart and field.selectionEnd ^
  // add opening and closing tags at start and end

  const markdownInputArr = [...document.getElementsByClassName("markdown-input")] // without the spread operator, this returns an htmlCollection
  const markdownInput = markdownInputArr[0]
  let inputValue = markdownInput.value
  const editorButtonsArr = [...document.getElementsByClassName('editor-button')]
  const renderedMarkdownSection = document.getElementById('rendered-markdown')
  
  let selectedCoordinates = null
  let selectedText = ""
  
  let editHistory = []
  
  function setInputValue (value) {
    markdownInput.value = value
  }
  
  let HistoryItem = class HistoryItem {
    constructor(charIndex, coordinateStart, coordinateEnd, openingTag, closingTag) {
      this.charIndex = charIndex
      this.coordinateStart = coordinateStart
      this.coordinateEnd = coordinateEnd
      this.openingTag = openingTag
      this.closingTag = closingTag
    }
  }

  markdownInput.addEventListener('click', (e) => {
    const { selectionStart, selectionEnd } = e.target
    
    selectedCoordinates = {
      selectionStart,
      selectionEnd
    }
  })
  
  
  // Input events
  markdownInput.addEventListener('input', (e) => {
    
    const { selectionStart, selectionEnd } = e.target
  
    setInputValue(e.target.value)
  
    switch (e.inputType) {
      case 'insertText' : {
        let charIndex = markdownInput.value.length - 1;
        editHistory.push(new HistoryItem(charIndex, null, null, null, null))
        break;
      }
  
      case 'historyUndo' : {
        let lastPieceOfHistory = editHistory[editHistory.length - 1]
        const { charIndex, coordinateStart, coordinateEnd, openingTag, closingTag } = lastPieceOfHistory
        
        if(charIndex || charIndex === 0) {
          setInputValue(markdownInput.value.slice(0, charIndex) + markdownInput.value.slice(charIndex + 1))
        } else {
          let stringBefore = markdownInput.value.substring(0, coordinateStart - openingTag.length)
          let stringInTags = markdownInput.value.substring(coordinateStart, coordinateEnd)
          let stringAfter = markdownInput.value.slice(coordinateEnd + closingTag.length)
          console.log({
            "before": stringBefore,
            "in tags": stringInTags,
            "after": stringAfter
          })
          setInputValue(stringBefore + stringInTags + stringAfter)
        }
        editHistory.pop()
        break;
      }
  
      case 'deleteContentBackward': {
        selectedText = ''
        setInputValue(markdownInput.value.slice(0, selectionStart)
        + markdownInput.value.slice(selectionEnd + 1))
        break;
      }
    }
    console.log(editHistory)
    renderedMarkdownSection.innerHTML = marked(markdownInput.value)
  }, false)
  
  
  // On Selection
  markdownInput.addEventListener('select', (e) => {

    selectedCoordinates = {
      selectionStart: e.target.selectionStart,
      selectionEnd: e.target.selectionEnd
    }
  
    let { selectionStart, selectionEnd } = selectedCoordinates
    selectedText = e.target.value.slice(selectionStart, selectionEnd)
  }, false)
  
  function addTags(openingTag, closingTag) {
    let { selectionStart, selectionEnd } = selectedCoordinates
    console.log(selectedText)
    setInputValue(markdownInput.value.slice(0, selectionStart)
    + openingTag 
    + selectedText
    + closingTag
    + markdownInput.value.slice(selectionEnd))
  
    selectedCoordinates = {
      selectionStart: selectionStart + openingTag.length,
      selectionEnd: selectionEnd + (closingTag ? closingTag.length : openingTag.length)
    }
  
    editHistory.push(new HistoryItem(null, selectionStart, selectionEnd, openingTag, closingTag))
    console.log(editHistory)
  }
  
  
  function handleEditorButtonClick(type) {

    let newLineOrEmpty = selectedText ? '\n' : ''
    let twoNewLinesOrEmpty = selectedText ? '\n \n' : ''

    switch(type) {
      case 'h1' : {
        addTags('# ', newLineOrEmpty)
        break;
      }
      case 'h2' : {
        addTags('## ', newLineOrEmpty)
        break;
      }
      case 'h3' : {
        addTags('### ', newLineOrEmpty)
        break;
      }
      case 'h4' : {
        addTags('#### ', newLineOrEmpty)
        break;
      }
      case 'h5' : {
        addTags('##### ', newLineOrEmpty)
        break;
      }
      case 'h6' : {
        addTags('###### ', newLineOrEmpty)
        break;
      }
      case 'linebreak' : {
        addTags('---', twoNewLinesOrEmpty)
        break;
      }
      case 'bold' : {
        addTags('**', '**')
        break;
      }
      case 'italic' : {
        addTags('*', '*')
        break;
      }
      case 'underline' : {
        addTags('<u>', '</u>')
        break;
      }
      case 'blockquote' : {
        addTags('> ', twoNewLinesOrEmpty)
        break;
      }
      default: return 
    }
    markdownInput.focus()
    renderedMarkdownSection.innerHTML = marked(markdownInput.value)
  }
  
  // On Editor Button Click
  for(let i = 0; i < editorButtonsArr.length; i++) {
      editorButtonsArr[i].addEventListener('click', (e) => {
  
      const buttonType = e.target.getAttribute('id').replace('button-', '')
  
      if(selectedCoordinates) {
        handleEditorButtonClick(buttonType, selectedCoordinates)
      } else {
        return 
      }
  
      // selectedCoordinates = null
    }, false)
  } 
  
  
  
  // For view only
  // Render markdown result after each change in the input (marked package)
    // Use highlight.js to also render code related tags
      // Give user a selection of the different code syntax options
      // Add line breaks and curly brackets around code snippet