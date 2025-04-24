document.getElementById("bugForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const severity = document.getElementById("severity").value;
    const status = document.getElementById("status").value;
    const bugId = document.getElementById("bugForm").dataset.editingId;
  
    let bugs = JSON.parse(localStorage.getItem("bugs")) || [];
  
    if (bugId) {
      const index = bugs.findIndex(b => b.id == bugId);
      bugs[index] = { ...bugs[index], title, description, severity, status };
      delete document.getElementById("bugForm").dataset.editingId;
    } else {
      const bug = {
        id: Date.now(),
        title,
        description,
        severity,
        status,
      };
      bugs.push(bug);
    }
  
    localStorage.setItem("bugs", JSON.stringify(bugs));
    document.getElementById("bugForm").reset();
    displayBugs();
  });
  
  function displayBugs(filterStatus = "All", filterSeverity = "All") {
    const bugList = document.getElementById("bugList");
    bugList.innerHTML = "";
  
    let bugs = JSON.parse(localStorage.getItem("bugs")) || [];
  
    if (filterStatus !== "All") {
      bugs = bugs.filter(bug => bug.status === filterStatus);
    }
    if (filterSeverity !== "All") {
      bugs = bugs.filter(bug => bug.severity === filterSeverity);
    }
  
    bugs.forEach((bug) => {
      const card = document.createElement("div");
      card.classList.add("bug-card");
  
      card.innerHTML = `
        <h3>${bug.title}</h3>
        <p>${bug.description}</p>
        <span class="tag tag-${bug.severity.toLowerCase()}">${bug.severity}</span>
        <span class="tag tag-status">${bug.status}</span>
        <br><br>
        <button onclick="editBug(${bug.id})">Edit</button>
        <button onclick="deleteBug(${bug.id})">Delete</button>
      `;
  
      bugList.appendChild(card);
    });
  }
  
  function deleteBug(id) {
    let bugs = JSON.parse(localStorage.getItem("bugs")) || [];
    bugs = bugs.filter(bug => bug.id !== id);
    localStorage.setItem("bugs", JSON.stringify(bugs));
    displayBugs();
  }
  
  function editBug(id) {
    const bugs = JSON.parse(localStorage.getItem("bugs")) || [];
    const bug = bugs.find(b => b.id === id);
  
    document.getElementById("title").value = bug.title;
    document.getElementById("description").value = bug.description;
    document.getElementById("severity").value = bug.severity;
    document.getElementById("status").value = bug.status;
    document.getElementById("bugForm").dataset.editingId = id;
  }
  
  // Filters
  const container = document.querySelector(".container");
  const filterDiv = document.createElement("div");
  filterDiv.innerHTML = `
    <label>Status:</label>
    <select id="filterStatus">
      <option value="All">All</option>
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Closed">Closed</option>
    </select>
  
    <label>Severity:</label>
    <select id="filterSeverity">
      <option value="All">All</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  `;
  
  filterDiv.style.marginBottom = "20px";
  container.insertBefore(filterDiv, document.getElementById("bugForm"));
  
  // Event listeners for filters
  const filterStatus = document.getElementById("filterStatus");
  const filterSeverity = document.getElementById("filterSeverity");
  
  filterStatus.addEventListener("change", () => {
    displayBugs(filterStatus.value, filterSeverity.value);
  });
  
  filterSeverity.addEventListener("change", () => {
    displayBugs(filterStatus.value, filterSeverity.value);
  });
  
  displayBugs();