const burgerTemplet = (brgerName, id, isFav) => {
  const burgerContainer = $("<div>").attr({
    class: "col-md-3 my-2 mx-1",
    id: `B_${id}`,
  });

  const card = $("<div>").attr({
    class: "card",
  });
  const img = $("<img>").attr({
    class: "card-img-top",
    src: `images/1.jpeg`,
    alt: "Card image cap",
    style: "width: 100%;height: 180px;",
  });
  const cardBody = $("<div>").attr({
    class: "card-body",
  });
  const cardTitle = $("<h5>").attr({
    class: "card-title",
    id: `B_${id}_name`,
  });
  cardTitle.html(`Name: ${brgerName}`);
  const btnsContainer = $("<div>").attr({
    class: "d-flex justify-content-evenly align-items-center",
  });
  const favBtn = $("<button>").attr({
    class: "btn btn-sm btn-primary",
    "data-toggle": "tooltip",
    "data-placement": "top",
    title: "Add to favorites",
    "data-id": id,
    "data-state": isFav,
  });
  favBtn.text("Add to Fav");
  const deleteBtn = $("<button>").attr({
    class: "btn btn-sm btn-danger",
    "data-toggle": "tooltip",
    "data-placement": "top",
    "data-name": `${brgerName}`,
    "data-id": `${id}`,
    onclick: "deleteBurger(this)",
  });

  deleteBtn.text("Delete");
  btnsContainer.append(favBtn, deleteBtn);
  cardBody.append(cardTitle, btnsContainer);

  card.append(img, cardBody);
  burgerContainer.append(card);
  return burgerContainer;
};

const displayNewBurger = (burger) => {
  const newBurger = burgerTemplet(burger.birger_name, burger.id, burger.isFav);
  $(".renderBurgers").prepend(newBurger);
};

const displayOnDelete = (id, message) => {
  $(`#B_${id}`).remove();
  alert(message);
};
const displayOnUpdate = (id, favState, favPage) => {
  if (!favPage && favPage === "false") {
    if (favState === 1) {
      $(`#favBtn_${id}`).replaceWith(
        `<span class="badge bg-secondary">Fav</span>`
      );
    } else {
      $(`#favBtn_${id}`)
        .replaceWith(`<button onclick="updateFav(this)" id="favBtn_${id}"
                        data-id="${id}"
                        data-state="${favState}"
                        class="btn btn-primary btn-sm">
                        Add to Fav
                    </button>`);
    }
  } else {
    $(`#B_${id}`).remove();
  }
};
const displayOnError = (err) => {
  alert(err);
};

$('button[name="AddBurger"]').on("click", (e) => {
  e.preventDefault();
  var burgerName = $('[name="burger_name"]').val();
  if (burgerName) {
    $("#burgerName_error").text("");
    $.post("/add", { birger_name: $('[name="burger_name"]').val() })
      .then((data) => {
        displayNewBurger(data.burger);
        alert(data.message);
        $('[name="burger_name"]').val("");
        $("#closeModel").click();
      })
      .catch((error) => {
        displayOnError(error.message);
      });
  } else {
    $("#burgerName_error").text("Please enter a burger name");
  }
});

const deleteBurger = function (e) {
  var isConfirm = confirm(`are you sure to delete " ${$(e).data("name")}" ?`);
  if (isConfirm) {
    $.ajax({
      type: "DELETE",
      url: "/delete",
      data: {
        id: $(e).data("id"),
      },
      success: function (data) {
        displayOnDelete($(e).data("id"), data.message);
      },
      error: function (xhr, status, error) {
        displayOnError(xhr.responseJSON.message);
      },
    });
  }
};

const updateFav = (e) => {
  const ChangFav = Number($(e).data("state")) === 0 ? 1 : 0;
  $.ajax({
    type: "PUT",
    url: "/UpdateFav",
    data: {
      id: $(e).data("id"),
      isFav: ChangFav,
    },
    success: function (data) {
      displayOnUpdate($(e).data("id"), ChangFav, $(e).data("fav"));
      return;
    },
    error: function (xhr, status, error) {
      displayOnError(xhr.responseJSON.message);
    },
  });
};
//serch
const getBurger = (e) => {
  var val = $('[name="searchTerm"]').val().trim();
  if (val) {
    window.location.href = `${$(e).attr("action")}?searchTerm${val}`;
  }
};
