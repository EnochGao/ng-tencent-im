export function titleNotify(count: number) {
  const hasNewMessage = count > 0;
  if (hasNewMessage) {
    if (document.title.search(/\((.*?)\)/) >= 0) {
      document.title = document.title.replace(/\((.*?)\)/, `(${count > 99 ? '99+' : count})`);
    } else {
      document.title = `(${count})${document.title}`;
    }
  } else {
    document.title = document.title.replace(/\((.*?)\)/, '');
  }
}
