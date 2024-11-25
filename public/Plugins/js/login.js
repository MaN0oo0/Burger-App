_user = undefined;
const User = {
  txtemail: "",
  txtpassword: "",
};
let setUser = (name, val) => {
  User[name] = val;
  return User;
};
const validtion = (name, val) => {
  if (name === "txtemail" && !val) {
    $(`#${name}_error`).html("email is required !");
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  if (name === "txtpassword" && !val) {
    $(`#${name}_error`).html("password is required !");
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  return true;
};

let InputOnChange = (e) => {
  let { name, value } = e;
  if (validtion(name, value)) {
    _user = { ...setUser(name, value) };
  }
};

OnSubmit = function (e) {
  if (_user) {
    var newErrorr = {
      txtemail: $("[name='txtemail']").val(),
      txtpassword: $("[name='txtpassword']").val(),
    };
    if (
      validtion("txtemail", newErrorr.txtemail) &&
      validtion("txtpassword", newErrorr.txtpassword)
    ) {
      console.log("Goood", _user);

      $.post("/login", { email: _user.txtemail, password: _user.txtpassword })
        .then((res) => {
          window.location.href = `/`;
        })
        .catch((error) => {
          $("#response_request").html(error.responseJSON.message);
        });
    } else {
      _user["txtemail"] = newErrorr.txtemail;
      _user["txtpassword"] = newErrorr.txtpassword;
      console.log("Not Goood", _user);
    }
  } else {
    const email = $("[name='txtemail']").val();
    const password = $("[name='txtpassword']").val();
    validtion("txtemail", email);
    validtion("txtpassword", password);
  }
};
// $('button[type="submit"]').on("click", function (e) {
//   e.preventDefault();
//   OnSubmit();
// });
