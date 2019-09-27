
const checkMark = (step) => {
  const mark = step.mark;
  return mark && mark.type.name === 'comment';
};

const getAnchorMark = (anchor) => {
  const nodeBefore = anchor.nodeBefore;
  const nodeAfter = anchor.nodeAfter;

  if (nodeBefore) {
    for (const mark of nodeBefore.marks) {
      if (mark.type.name === 'comment') {
        return mark;
      }
    }
  }

  if (nodeAfter) {
    for (const mark of nodeAfter.marks) {
      if (mark.type.name === 'comment') {
        return mark;
      }
    }
  }

  return null;
};

export const getCommentStep = (transaction) => {
  for (const step of transaction.steps) {
    if (checkMark(step)) {
      return step;
    }
  }
  return null;
};

export const getClickMark = (transaction) => {
  if (transaction.meta.pointer) {
      const selection = transaction.curSelection;
      const anchor = selection.$anchor;

      return getAnchorMark(anchor);
  }
  return null;
};
