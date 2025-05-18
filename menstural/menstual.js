
// class CycleTracker {
//     constructor() {
//         this.cycles = JSON.parse(localStorage.getItem('cycles')) || [];
//         this.averageCycleLength = this.calculateAverageCycle();
//     }

//     addCycle(startDate) {
//         const cycle = {
//             startDate: new Date(startDate),
//             id: Date.now()
//         };
//         this.cycles.push(cycle);
//         this.updateStorage();
//         this.calculateAverageCycle();
//     }

//     deleteCycle(id) {
//         this.cycles = this.cycles.filter(cycle => cycle.id !== id);
//         this.updateStorage();
//         this.calculateAverageCycle();
//     }

//     calculateAverageCycle() {
//         if (this.cycles.length < 2) return 28;

//         const lengths = [];
//         for (let i = 1; i < this.cycles.length; i++) {
//             const diff = this.cycles[i].startDate - this.cycles[i - 1].startDate;
//             lengths.push(Math.floor(diff / (1000 * 60 * 60 * 24)));
//         }

//         const average = lengths.reduce((a, b) => a + b, 0) / lengths.length;
//         this.averageCycleLength = Math.round(average);
//         return this.averageCycleLength;
//     }

//     predictNextPeriod() {
//         if (this.cycles.length === 0) return null;
//         const lastCycle = this.cycles[this.cycles.length - 1];
//         const nextDate = new Date(lastCycle.startDate);
//         nextDate.setDate(nextDate.getDate() + this.averageCycleLength);
//         return nextDate;
//     }

//     predictOvulation() {
//         if (this.cycles.length === 0) return null;
//         const lastCycle = this.cycles[this.cycles.length - 1];
//         const ovulationStart = new Date(lastCycle.startDate);
//         ovulationStart.setDate(ovulationStart.getDate() + (this.averageCycleLength - 14));
//         const ovulationEnd = new Date(ovulationStart);
//         ovulationEnd.setDate(ovulationEnd.getDate() + 5);
//         return { start: ovulationStart, end: ovulationEnd };
//     }

//     updateStorage() {
//         localStorage.setItem('cycles', JSON.stringify(this.cycles));
//     }
// }

// const tracker = new CycleTracker();

// function logCycle() {
//     const dateInput = document.getElementById('cycleStart');
//     if (!dateInput.value) return alert('Please select a date');

//     tracker.addCycle(dateInput.value);
//     dateInput.value = '';
//     updateDisplay();
// }

// function deleteCycle(id) {
//     tracker.deleteCycle(id);
//     updateDisplay();
// }

// function formatDate(date) {
//     return date?.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//     }) || '--';
// }

// function updateDisplay() {
//     // Update predictions
//     const nextPeriod = tracker.predictNextPeriod();
//     document.getElementById('nextPeriod').textContent = formatDate(nextPeriod);

//     const ovulation = tracker.predictOvulation();
//     document.getElementById('ovulationWindow').textContent =
//         ovulation ? `${formatDate(ovulation.start)} - ${formatDate(ovulation.end)}` : '--';

//         sessionStorage.setItem("next", formatDate(nextPeriod))
//         sessionStorage.setItem("start", formatDate(ovulation.start))
//         sessionStorage.setItem("end", formatDate(ovulation.end))

//     // Update history
//     const historyList = document.getElementById('historyList');
//     historyList.innerHTML = tracker.cycles.map(cycle => `
//                 <div class="history-item">
//                     <span>${formatDate(new Date(cycle.startDate))}</span>
//                     <button class="delete-btn" onclick="deleteCycle(${cycle.id})">Delete</button>
//                 </div>
//             `).join('');

            
// }

// // Initial display
// updateDisplay();

    function logCycle() {
      const input = document.getElementById("cycleStart");
      const history = document.getElementById("historyList");
      const date = new Date(input.value);

      if (!input.value) {
        Swal.fire('Please select a date!', '', 'warning');
        return;
      }

      // Display alert
      Swal.fire({
        title: 'Cycle Logged!',
        text: `Start Date: ${date.toDateString()}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // Prediction (Assuming 28-day cycle)
      const next = new Date(date);
      next.setDate(next.getDate() + 28);
      const ovulation = new Date(date);
      ovulation.setDate(ovulation.getDate() + 14);

   
      document.getElementById("nextPeriod").textContent = next.toDateString();
      document.getElementById("ovulationWindow").textContent = ovulation.toDateString();

      // Save to localStorage for dashboard
      localStorage.setItem("nextPeriod", next.toDateString());
      localStorage.setItem("ovulationWindow", ovulation.toDateString());

      // Add to history
      const entry = document.createElement("div");
      entry.textContent = `Logged: ${date.toDateString()}`;
      history.prepend(entry);

      input.value = "";
    }
 