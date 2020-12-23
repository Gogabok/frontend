global.window.document.createRange = function createRange () {
  const range = {
    setEnd: (node, endOffset) => {
      range.endContainer = node
      range.endOffset = endOffset
    },
    setEndAfter: () => {
      range.endOffset = 2
    },
    setEndBefore: () => {
      range.endOffset = 0
    },
    setStart: (node, startOffset) => {
      range.startContainer = node
      range.startOffset = startOffset
    },
    setStartAfter: () => {
      range.startOffset = 2
    },
    setStartBefore: () => {
      range.startOffset = 0
    },
    insertNode: () => {},
    endContainer: {},
    endOffset: 1,
    startContainer: {},
    startOffset: 1
  }

  return range
}

global.window.getSelection = function () {
  return {
    removeAllRanges: () => {},
    addRange: () => {},
    getRangeAt: () => {
      return {
        endContainer: document.createElement('div'),
        endOffset: 1,
        startContainer: document.createElement('div'),
        startOffset: 1
      }
    }
  }
}

global.window.document.getSelection = global.window.getSelection
