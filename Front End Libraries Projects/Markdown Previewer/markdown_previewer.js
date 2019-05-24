    marked.setOptions({
      gfm: true,
      highlight: false,
      tables: false,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      langPrefix: false
    });

class Markdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      textInput: placeholder,
      expandEditor: "editorMin",
      expandPreview: "rendererMin"
    };
  }
  
  handleChange(event){
    this.setState({
      textInput: event.target.value
    });
  }

  getMarkdownText(input) {
    var rawMarkup = marked(input, {sanitize: true});
    return { __html: rawMarkup };
  }
  
  resizeEditor() {
    if (this.state.expandEditor === 'editorMin') {
      this.setState({expandEditor: 'editorMax'});
    } else {
      this.setState({expandEditor: 'editorMin'});
    }
  }
  
  resizePreview() {
    if (this.state.expandPreview === 'rendererMin') {
      this.setState({expandPreview: 'rendererMax'});
    } else {
      this.setState({expandPreview: 'rendererMin'});
    }
  }
  
  render() {
    return (
      <div class="appContainer">
        
        <div className={this.state.expandEditor}>          
          <div id="console-window">
            <div id="console-bar">
              <h3 class="window-title">Editor<button onClick={this.resizeEditor.bind(this)}><i class="far fa-window-maximize expand"></i></button></h3>            
            </div>
            <textarea id="editor" value={this.state.textInput} onChange={this.handleChange.bind(this)}></textarea>
          </div>
        </div>
        
        <div className={this.state.expandPreview}>
          <div id="console-window">
            <div id="console-bar">
              <h3 class="window-title">Preview<button onClick={this.resizePreview.bind(this)}><i class="far fa-window-maximize expand"></i></button></h3>
            </div>
            <div id="preview" dangerouslySetInnerHTML={this.getMarkdownText(this.state.textInput)} />
          </div>
        </div>
        
      </div>
    );
  } 
}

const placeholder = 
`# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`

ReactDOM.render(<Markdown />, document.getElementById("app"));
