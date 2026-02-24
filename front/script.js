const API = "http://localhost:3000"
const $ = s => document.querySelector(s)



$("#registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const name = document.getElementById("regName").value.trim()
    const email = document.getElementById("regEmail").value.trim()
    const password = document.getElementById("regPassword").value.trim()
    const checkPassword = document.getElementById("regPassword2").value.trim()
    const regIsAdminEl = document.getElementById("regIsAdmin")
    if (checkPassword === password && name && email && password) {
        const res = await fetch(API + "/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({name, email, password,role:regIsAdminEl.checked}),
        });
        const data = await res.json()
        console.log(data)

    }

})


$("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("loginEmail").value.trim()
    const password = document.getElementById("loginPassword").value.trim()
    if(!email || !password){
        throw new Error()
    }
    const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
        const err = await res.json()
        return err
    }
   profile()

})


$("#btnLogout").onclick =async function () {
    try{
       const res =  await fetch(API + '/logout', {
            method: "GET",
            credentials: "include"
        })
        if(!res.ok){
            const err = await res.json()
            console.log(err)
            return
        }
        $("#guestArea").classList.remove("d-none")
        $("#appArea").classList.add("d-none")

    }catch (err){
        return err
    }
}

$("#profileForm").addEventListener("submit", async (e) => {
    try{
        e.preventDefault()
        let name = $("#profileName").value
        let email = $("#profileEmail").value
        let id = $("#profileId").value
        const res = await fetch(API + "/edit",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({name,email,id}),
        })
        if(!res.ok){
            const err = await res.json()
            console.log("Edit error:", err)
            return
        }
        console.log("edit succes")
    }catch (err){
        return err
    }

})

async function profile(){
   try {
       const profileRes = await fetch(API + "/profile", {
           credentials: "include"
       })
       if (!profileRes.ok) {
           return profileRes.json()
       }
       const profile = await profileRes.json()
       if (profile.user.isAdmin) {
           admin(profile.user)
       }
       $("#guestArea").classList.add("d-none")
       $("#appArea").classList.remove("d-none")

       $("#profileRole").value = profile.user.isAdmin
       $("#profileId").value = profile.user.id
       $("#profileName").value = profile.user.name
       $("#profileEmail").value = profile.user.email

       console.log(profile)

   }catch(err){
       console.log("profile error:", err)
   }
}


async function admin(user){
    try{
        console.log(user)
        if(user.isAdmin){
            $("#adminTabBtn").classList.remove("d-none")
            const res = await fetch(API + "/users", {
                method: "GET",
                credentials: "include"
            })
            const data = await res.json()
            $("#usersTbody").innerHTML = data.map(item => adminUserHtml(item)).join(" ");
            console.log(data)
        }else {
            $("#adminTabBtn").classList.add("d-none")
            $("#tabAdmin").classList.add("d-none")
        }
    }catch(err){
        $("#tabAdmin").classList.add("d-none")
        console.log(err)

    }
}

function adminUserHtml(user){
    return `<tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="badge ${user.isAdmin ? 'badge-soft' : 'badge-user'}">
                                ${user.isAdmin ? 'Admin' : 'User'}
                        </span>                   
                    </td>
                    <td>2026-02-02</td>
                  </tr>`
}



$("#passForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    try{
        const password = document.getElementById("curPass").value.trim()
        const newPassword = document.getElementById("newPass").value.trim()
        const cnewPass = document.getElementById("newPass2").value.trim()

        if(cnewPass !== newPassword){
            return console.log("password does not match")
        }
        const res = await fetch(API + "/cpassword",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({password,newPassword}),
        })
        if(!res.ok){
            const err = await res.json()
            return err
        }
        const data = await res.json()
        console.log(data)
    }catch (err){
        console.log(err)
    }

})







$("#tabs").onclick =async function (e){
    const tabElm = $("#tabProfile")
    const adminTabElm = $("#tabAdmin")
    const changePasswordElm = $("#tabChangePass")
    let currentTarget = e.target.closest("button")
        $(".nav-link.active").classList.remove("active")
        currentTarget.classList.add("active")
    if(currentTarget.dataset.tab === "tabProfile"){
        tabElm.classList.remove("d-none")
        adminTabElm.classList.add("d-none")
        changePasswordElm.classList.add("d-none")
    }else if(currentTarget.dataset.tab === "tabChangePass"){
        changePasswordElm.classList.remove("d-none")
        adminTabElm.classList.add("d-none")
        tabElm.classList.add("d-none")
    }else if(currentTarget.dataset.tab === "tabAdmin"){
        adminTabElm.classList.remove("d-none")
        tabElm.classList.add("d-none")
        changePasswordElm.classList.add("d-none")
    }
}




profile()







