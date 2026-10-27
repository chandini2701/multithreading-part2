let daemonTimer = null;
let daemonStep = 0;
let daemonRunning = false;
let counterRunning = false;

function runDaemon() {
  if (daemonRunning) return;

  daemonRunning = true;
  daemonStep = 0;

  const bar = document.getElementById("daemonBar");
  const status = document.getElementById("daemonStatus");
  const output = document.getElementById("daemonOutput");

  clearInterval(daemonTimer);
  status.textContent = "Running";
  output.textContent = "Background task started...\n";

  daemonTimer = setInterval(function () {
    daemonStep++;
    bar.style.width = daemonStep * 20 + "%";
    output.textContent += "Background task step " + daemonStep + "\n";

    if (daemonStep >= 5) {
      clearInterval(daemonTimer);
      status.textContent = "Main task finished";
      output.textContent +=
        "Simulation finished. Real daemon threads may stop when the JVM has no live non-daemon threads.";
      daemonRunning = false;
    }
  }, 400);
}

function resetDaemon() {
  clearInterval(daemonTimer);
  daemonRunning = false;
  daemonStep = 0;

  document.getElementById("daemonBar").style.width = "0%";
  document.getElementById("daemonStatus").textContent = "Not started";
  document.getElementById("daemonOutput").textContent = "Waiting to start...";
}

function runPriority() {
  const a = Number(document.getElementById("p1").value);
  const b = Number(document.getElementById("p2").value);

  document.getElementById("priorityOutput").textContent =
    "Thread A priority: " +
    a +
    "\nThread B priority: " +
    b +
    "\n\nHigher priority is only a scheduling hint." +
    "\nActual execution order is not guaranteed.";
}

async function runCounter() {
  if (counterRunning) return;
  counterRunning = true;

  const safe = document.getElementById("syncToggle").checked;
  const display = document.getElementById("syncCount");
  const output = document.getElementById("syncOutput");

  let count = 0;
  display.textContent = "0";
  output.textContent = safe
    ? "Synchronization ON: processing updates..."
    : "Synchronization OFF: simulating competing updates...";

  for (let i = 0; i < 20; i++) {
    if (safe) {
      count += 10;
    } else {
      // Simulate lost increments from concurrent updates.
      count += 8;
    }

    display.textContent = count;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  output.textContent =
    "Final count: " +
    count +
    "\nExpected count: 200" +
    (safe
      ? "\nAll simulated updates were preserved."
      : "\nSome simulated updates were lost.");

  document.getElementById("syncLabel").textContent = safe
    ? "Synchronization is ON."
    : "Synchronization is OFF.";

  counterRunning = false;
}

function resetCounter() {
  if (counterRunning) return;

  document.getElementById("syncCount").textContent = "0";
  document.getElementById("syncOutput").textContent =
    "Expected final count: 200";
}

function runRace() {
  const expected = 200;
  const simulatedActual = 137;

  document.getElementById("raceOutput").textContent =
    "Expected: " +
    expected +
    "\nSimulated actual: " +
    simulatedActual +
    "\nLost updates: " +
    (expected - simulatedActual) +
    "\n\nThis is an illustrative simulation, not a real thread execution.";
}

function runSafeRace() {
  document.getElementById("safeOutput").textContent =
    "Expected: 200" +
    "\nActual: 200" +
    "\nAll simulated updates preserved." +
    "\n\nA real Java solution can use synchronized.";
}
