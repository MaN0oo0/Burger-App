_user = undefined;
const User = {
  username: "",
  email: "",
  password: "",
  resturent_id: "",
};
let setUser = (name, val) => {
  User[name] = val;
  return User;
};
const validtion = (name, val) => {
  if (name === "email" && !val) {
    $(`#${name}_error`).html(`${name} is required !`);
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  if (name === "password" && !val) {
    $(`#${name}_error`).html(`${name} is required !`);
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  if (name === "username" && !val) {
    $(`#${name}_error`).html(`${name} is required !`);
    return false;
  } else {
    $(`#${name}_error`).html("");
  }
  if (name === "resturent_id" && val == "") {
    $(`#${name}_error`).html(`${name} is required !`);
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
      txtemail: $("[name='email']").val(),
      txtpassword: $("[name='password']").val(),
      txtusername: $("[name='username']").val(),
      txtresturent_id: $("[name='resturent_id']").val(),
    };
    if (
      validtion("email", newErrorr.txtemail) &&
      validtion("password", newErrorr.txtpassword) &&
      validtion("resturent_id", newErrorr.txtresturent_id) &&
      validtion("username", newErrorr.txtusername)
    ) {
      console.log("Goood", _user);

      $.post("/register", _user)
        .then((res) => {
          console.log(res.data);
          location.href = "/account?action=login";
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      _user["email"] = newErrorr.txtemail;
      _user["password"] = newErrorr.txtpassword;
      _user["username"] = newErrorr.txtusername;
      _user["resturent_id"] = newErrorr.txtresturent_id;
      console.log("Not Goood", _user);
    }
  } else {
    const email = $("[name='email']").val();
    const password = $("[name='password']").val();
    var newErrorr = {
      email: $("[name='email']").val(),
      password: $("[name='password']").val(),
      username: $("[name='username']").val(),
      resturent_id: $("[name='resturent_id']").val(),
    };
    for (const key in newErrorr) {
      const element = newErrorr[key];
      validtion(key, element);
    }
  }
};
