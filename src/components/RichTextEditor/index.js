import React, { Component } from 'react';
import Head from 'next/head';
import 'react-quill/dist/quill.snow.css';
import isBrowser from 'is-browser';
import style from '../../static/css/main.css';

const colorArray = [
  '#000',
  '#fff',
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];

let ReactQuill;

if (isBrowser) {
  ReactQuill = require('react-quill');
}

class MyRichTextEditor extends Component {
  state = {
    editorVal: '',
  };

  modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link'],
      [{ color: colorArray }, { background: colorArray }],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  handleChange = (content, delta, source, editor) => {
    const { onChange } = this.props;

    this.setState({ editorVal: content });

    if (onChange && typeof onChange === 'function') {
      onChange(content, delta, source, editor);
    }
  };

  render() {
    const { onChange, ...rest } = this.props;
    return isBrowser ? (
      <div>
        <Head>
          <link
            href="//cdn.quilljs.com/1.2.6/quill.snow.css"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <ReactQuill
          value={this.state.editorVal}
          onChange={this.handleChange}
          modules={this.modules}
          {...rest}
        />
      </div>
    ) : null;
  }
}

export default MyRichTextEditor;
