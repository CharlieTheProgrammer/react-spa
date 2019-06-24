import firebase from "./firebase";

const getMeetings = (userID) => {
    if (!userID) throw Error("Missing User ID.")

    const meetingsRef = firebase.database().ref(`/meetings/${userID}`)

    return new Promise((resolve, reject) => {
        meetingsRef.on('value', snapshot => {
            let meetings = snapshot.val()
            let meetingsList = []
            //console.log(meetings)

            for (let key in meetings) {
                meetingsList.push({
                    meetingID: key,
                    meetingName: meetings[key].meetingName,
                    attendees: meetings[key].attendees
                })
            }
            resolve(meetingsList)
        })
    })
}

export default {
    getMeetings
}