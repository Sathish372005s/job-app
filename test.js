(async () => {
    try {
        // First register to get a token
        const authRes = await fetch('https://job-app-1-490s.onrender.com/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "TestUser",
                email: `test${Date.now()}@example.com`,
                password: "password123",
                role: "recruiter"
            })
        });
        const authData = await authRes.json();
        const token = authData.token;
        console.log("Registered, got token");

        const formData = new FormData();
        formData.append("title", "Dev");
        formData.append("company", "Test Co");
        formData.append("location", "Remote");
        formData.append("salary", "1000");
        formData.append("description", "Dev job");
        formData.append("skills", "React");
        formData.append("jobtype", "Full-time");
        
        const res = await fetch('https://job-app-1-490s.onrender.com/api/job/createjob', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
            body: formData
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e);
    }
})();
