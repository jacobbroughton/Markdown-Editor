// Use the user's selection
  // field.selectionStart and field.selectionEnd ^
  // add opening and closing tags at start and end

const markdownInputArr = [...document.getElementsByClassName("markdown-input")] // without the spread operator, this returns an htmlCollection
const markdownInput = markdownInputArr[0]

markdownInput.addEventListener('input', (e) => {
  console.log(e.target.value)
}, false)


// For view only
// Render markdown result after each change in the input (marked package)
  // Use highlight.js to also render code related tags
    // Give user a selection of the different code syntax options
    // Add line breaks and curly brackets around code snippet