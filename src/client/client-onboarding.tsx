import { useActionData } from "react-router";
import { HomepageHeader } from "../homepage";
import { useState } from "react";

function ClienOnboarding() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [userIndustry, setUserIndustry] = useState('')
    const [userameOB, setUsernameOB] = useState('')
    const [passwordOB, setPasswordOB] = useState('')

    var confPassword

    function handleRegistration () {

    }
    return (
        <main>
            <HomepageHeader />

            <a className="cancel-registration" href="/" aria-label="Cancel registration">
                Cancel
            </a>
            <div className="registration-form">
                <form className="registration-form" onSubmit={handleRegistration}>
                    <label>
                        <span>Organisation Name</span>
                        <input
                            name = "org_name"
                            type="text"
                            value = {name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </label>
                    <label>
                        <span>Email Address</span>
                        <input
                            name="email"
                            autoComplete="email"
                            type="text"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>
                    <label>
                        <span>Enter Industry</span>
                        <input
                            name="industry"
                            type="text"
                            value={userIndustry}
                            onChange={(event) => setUserIndustry(event.target.value)}
                        />
                    </label>
                    <label>
                        <span>Set Username</span>
                        <input
                            name="username"
                            type="text"
                            value={userameOB}
                            onChange={(event) => setUsernameOB(event.target.value)}
                        />
                    </label>
                    <label>
                        <span>Password</span>
                        <span>Unallowed Characters: ", ', \, :, ;, &, ^, |</span>
                        <input
                            name="password"
                            type="text"
                            value={passwordOB}
                            onChange={(event) => setPasswordOB(event.target.value)}
                        />
                    </label>
                    <label>
                        <span>Confirm Password</span>
                        <input
                            name="confirm-password"
                            type="text"
                            value={confPassword}
                        />
                    </label>
                </form>
                <button className="" type="submit" disabled={}>

                </button>
            </div>
        </main>
    )
}