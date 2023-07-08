const deleteIcon = () => {
  const i = document.createElement('i');
  i.classList.add('uil-trash', 'trashIcon', 'icon');
  i.addEventListener('click', deleteTask);
  return i;
};

const deleteTask = (event) => {
  const parent = event.target.parentElement;
  parent.remove();
};

export default deleteIcon;