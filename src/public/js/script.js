let containers = document.querySelectorAll(".container");
function findContainer(important, urgent) {
  let containerIndex;
  if (urgent) {
    if (important) {
      containerIndex = 0;
    } else {
      containerIndex = 1;
    }
  } else {
    if (important) {
      containerIndex = 2;
    } else {
      containerIndex = 3;
    }
  }
  return containerIndex;
}
// Get the modal
let modals = {
  create: document.getElementById("myModal"),
  view: document.getElementById("viewActivity"),
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (Object.values(modals).indexOf(event.target) > -1) {
    event.target.style.display = "none";
  }
};

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const drag = document.querySelector(".drag.ing");
    container.appendChild(drag);
  });
});

function createActivity(dragObject) {
  addDraggable(
    containers[findContainer(dragObject.important, dragObject.urgent)],
    dragObject
  );
}
function deleteActivity(id) {
  $.ajax({
    url: "/activities",
    type: "DELETE",
    data: { id: id },
    dataType: "json",
    success: (data) => {
      let drag = $(`[data-id=${data.id}]`);
      //console.log(drag);
      drag.remove();
    },
  });
}

function addDraggable(cont, dragObject) {
  let wrapper = document.createElement("div");
  wrapper.classList.add("drag");
  wrapper.setAttribute("draggable", "true");
  wrapper.setAttribute("data-id", dragObject._id);
  wrapper.addEventListener("dragstart", () => {
    wrapper.classList.add("ing");
  });
  wrapper.addEventListener("dragend", () => {
    wrapper.classList.remove("ing");
  });

  let drag = document.createElement("span");
  drag.classList.add("fill");
  drag.addEventListener("click", () => {
    viewDragContent(dragObject._id);
  });

  drag.innerText = dragObject.title;

  wrapper.appendChild(drag);
  addRemoveButton(wrapper, dragObject._id);
  cont.appendChild(wrapper);
}

function addRemoveButton(cont, id) {
  let button = document.createElement("span");
  let icon = document.createElement("i");
  icon.classList.add("fas");
  icon.classList.add("fa-trash-alt");

  button.appendChild(icon);
  button.classList.add("cell");
  button.addEventListener("click", (e) => {
    deleteActivity(id);
  });

  cont.appendChild(button);
}

function viewDragContent(id) {
  const config = {
    url: "/activities",
    type: "POST",
    dataType: "json",
    data: { id: id },
    success: (data) => {
      let activity = data[0];
      let modal = modals.view;
      let close = modal.querySelector(".close");
      let title = document.getElementById("viewActivity-title");
      let description = document.getElementById("viewActivity-description");
      title.innerText = activity.title;
      description.innerText = activity.description;
      close.addEventListener("click", () => {
        modal.style.display = "none";
      });
      modal.style.display = "block";
    },
  };
  $.ajax(config);
}

//actions to take when the page is ready
$(document).ready(() => {
  //open the create modal form on click
  $("#myBtn").on("click", () => {
    let modal = modals.create;
    let close = modal.querySelector(".close");
    close.onclick = function () {
      modal.style.display = "none";
    };

    const addButton = document.querySelector("#addActivity");
    addButton.addEventListener("click", (e) => {
      modals.create.style.display = "none";
    });

    modal.style.display = "block";
  });
});
$(document).ready(function () {
  //bind the createActivity form to an ajax request
  let config = {
    dataType: "json",
    clearForm: true,
    success: (data) => {
      createActivity(data);
    },
    beforeSubmit: (data) => {
      console.log(data);
    },
  };
  $("#createActivity").ajaxForm(config);
});
$(document).ready(() => {
  //load all activity when the page is loaded
  const config = {
    url: "/activities",
    type: "GET",
    dataType: "json",
    success: (data) => {
      for (activity of data) {
        createActivity(activity);
      }
    },
  };
  $.ajax(config);
});
