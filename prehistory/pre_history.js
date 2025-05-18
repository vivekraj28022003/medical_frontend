const userId = localStorage.getItem("userId") || null;

async function loadHistory() {
  if (!userId) {
    console.error("User ID not found");
    return;
  }

  try {
    // Fetch blood pressure and sugar level records
    const [bpRes, sugarRes] = await Promise.all([
      fetch(`https://medical-backend-kf3a.onrender.com/api/blood-pressure/user/${userId}`),
      fetch(`https://medical-backend-kf3a.onrender.com/api/sugar-level/user/${userId}`)
    ]);

    if (!bpRes.ok || !sugarRes.ok) throw new Error("Failed to fetch data");

    const [bpData, sugarData] = await Promise.all([bpRes.json(), sugarRes.json()]);

    // Create a map with timestamp as key to merge records
    const dataMap = new Map();

    bpData.forEach(bp => {
      const key = bp.timestamp;
      dataMap.set(key, {
        timestamp: key,
        formattedDate: new Date(key).toLocaleString(),
        bpId: bp.id,
        systolic: bp.systolic,
        diastolic: bp.diastolic,
        sugarId: null,
        level: "-"
      });
    });

    sugarData.forEach(sugar => {
      const key = sugar.timestamp;
      if (dataMap.has(key)) {
        const existing = dataMap.get(key);
        existing.sugarId = sugar.id;
        existing.level = sugar.level;
      } else {
        dataMap.set(key, {
          timestamp: key,
          formattedDate: new Date(key).toLocaleString(),
          bpId: null,
          systolic: "-",
          diastolic: "-",
          sugarId: sugar.id,
          level: sugar.level
        });
      }
    });

    // Convert map to sorted array
    const combinedData = Array.from(dataMap.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const historyTable = document.getElementById("history-table");
    historyTable.innerHTML = "";

    if (combinedData.length === 0) {
      historyTable.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-gray-500">No health records found.</td>
        </tr>
      `;
      return;
    }

    // Populate the table
    combinedData.forEach((entry) => {
      const row = document.createElement("tr");
      row.className = "hover:bg-blue-50 transition";

      row.innerHTML = `
        <td class="px-4 py-3">${entry.formattedDate}</td>
        <td class="px-4 py-3">${entry.systolic}/${entry.diastolic}</td>
        <td class="px-4 py-3">${entry.level}</td>
        <td class="px-4 py-3 text-center">
          ${entry.bpId && entry.sugarId ? 'BP & Sugar' :
            entry.bpId ? 'Blood Pressure' :
            entry.sugarId ? 'Sugar Level' : '-'}
       
      `;

      historyTable.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load health history.");
  }
}

async function deleteBoth(bpId, sugarId) {
  if (!userId) return;

  if (!confirm("Are you sure you want to delete this entry?")) return;

  try {
    if (bpId) {
      const bpRes = await fetch(`/api/blood-pressure/${bpId}`, {
        method: "DELETE",
      });
      if (!bpRes.ok) throw new Error("Failed to delete BP entry");
    }

    if (sugarId) {
      const sugarRes = await fetch(`/api/sugar-level/${sugarId}`, {
        method: "DELETE",
      });
      if (!sugarRes.ok) throw new Error("Failed to delete Sugar entry");
    }

    await loadHistory();
  } catch (err) {
    console.error(err);
    alert("Failed to delete the entry.");
  }
}

window.onload = loadHistory;
