
# TangiQuest Maze Game

## RFID-Based Tangible HCI Maze Game Controller

TangiQuest Maze Game is an Arduino-based tangible Human-Computer Interaction project where RFID cards are used as physical input commands to control a maze game. Instead of using a keyboard or mouse, the player scans different RFID cards to start the game, move the robot, turn left, or submit an action.

This project combines Arduino UNO, MFRC522 RFID reader, LEDs, buzzer feedback, and serial communication to create an interactive physical-to-digital game experience.

---

## Project Overview

The main goal of this project is to make a simple maze game more interactive using RFID-based tangible controls. Each RFID card works like a command button. When a card is scanned, the Arduino reads the card UID and sends a command through the Serial Monitor.

The system gives feedback using:

- Green LED for valid RFID commands
- Red LED for unknown or invalid RFID cards
- Buzzer sound for interaction feedback
- Serial output for communication with the game interface

---

## Features

- RFID card-based game control
- Arduino UNO and MFRC522 RFID module integration
- START, MOVE, LEFT, and SUBMIT command support
- Green LED feedback for valid commands
- Red LED feedback for invalid cards
- Buzzer feedback for user interaction
- Serial communication for connecting with a web-based maze game
- Wokwi simulation support

---

## Hardware Components

| Component | Quantity |
|----------|----------|
| Arduino UNO | 1 |
| MFRC522 RFID Reader | 1 |
| RFID Cards / Tags | 4 or more |
| Green LED | 1 |
| Red LED | 1 |
| Buzzer | 1 |
| Resistors | 2 |
| Jumper Wires | As needed |
| Breadboard | Optional |

---

## Circuit Diagram

![TangiQuest Circuit Diagram](simulation(1).png)

The circuit uses an Arduino UNO connected with an MFRC522 RFID module. The green LED, red LED, and buzzer are used to provide feedback after scanning RFID cards.

---

## Pin Configuration

### RFID RC522 Module

| RFID RC522 Pin | Arduino UNO Pin |
|---------------|-----------------|
| SDA / SS | D10 |
| SCK | D13 |
| MOSI | D11 |
| MISO | D12 |
| RST | D9 |
| GND | GND |
| 3.3V | 3.3V |

> Important: The RFID RC522 module should be connected to 3.3V, not 5V.

### Output Devices

| Device | Arduino Pin |
|-------|-------------|
| Buzzer | D5 |
| Green LED | D6 |
| Red LED | D7 |

---

## RFID Card Commands

Each RFID card is assigned to a specific game command.

| Card | Command | Purpose |
|-----|---------|---------|
| Card 1 | START | Starts the maze game |
| Card 2 | MOVE | Moves the robot/player forward |
| Card 3 | LEFT | Turns the robot/player left |
| Card 4 | SUBMIT | Submits the current action |

Example UID configuration in the Arduino code:

```cpp
String START_UID  = "1702F006";
String MOVE_UID   = "11223344";
String LEFT_UID   = "55667788";
String SUBMIT_UID = "AABBCCDD";
````

You must replace these UID values with your own RFID card UIDs.

---

## How It Works

1. The user scans an RFID card using the MFRC522 RFID reader.
2. Arduino reads the UID of the scanned card.
3. The UID is compared with predefined UID values in the code.
4. If the UID matches a known card, Arduino sends a command such as `START`, `MOVE`, `LEFT`, or `SUBMIT`.
5. The green LED turns on and the buzzer gives a short sound for valid commands.
6. If the UID is unknown, the red LED turns on and the buzzer gives an error sound.
7. The command can be used by a web-based maze game through serial communication.

---

## Serial Output Example

When a valid card is scanned, the Arduino prints output like this:

```text
UID:1702F006
COMMAND:START
```

For an unknown RFID card:

```text
UID:XXXXXXXX
COMMAND:UNKNOWN
```

---

## Required Arduino Libraries

Install the following libraries in Arduino IDE:

* SPI
* MFRC522

The SPI library is included by default with Arduino IDE. The MFRC522 library can be installed from the Arduino Library Manager.

---

## Setup Instructions

### 1. Connect the Circuit

Connect the Arduino UNO, MFRC522 RFID reader, LEDs, and buzzer according to the pin configuration table.

### 2. Install Required Library

Open Arduino IDE and install:

```text
MFRC522 by GithubCommunity
```

Go to:

```text
Sketch > Include Library > Manage Libraries
```

Then search for `MFRC522` and install it.

### 3. Find RFID Card UID

Upload the UID checker code first. Open the Serial Monitor and scan each RFID card. Copy the UID shown in the Serial Monitor.

Example:

```text
Card UID: 1702F006
```

### 4. Update the Final Arduino Code

Replace the default UID values with your own RFID card UIDs.

```cpp
String START_UID  = "YOUR_START_CARD_UID";
String MOVE_UID   = "YOUR_MOVE_CARD_UID";
String LEFT_UID   = "YOUR_LEFT_CARD_UID";
String SUBMIT_UID = "YOUR_SUBMIT_CARD_UID";
```

### 5. Upload the Final Code

Upload the final Arduino code to the Arduino UNO.

### 6. Test the System

Open the Serial Monitor at:

```text
9600 baud
```

Scan the RFID cards and check whether the correct command is printed.

---

## Wokwi Simulation

You can test the project using the Wokwi simulation:

```text
https://wokwi.com/projects/463890627283106817
```

---

## Project Applications

This project can be used for:

* Tangible HCI learning
* RFID-based educational games
* Interactive maze game control
* Arduino and sensor-based project demonstration
* Physical input system for web games
* Classroom or lab-based embedded system projects

---

## Future Improvements

* Add more RFID command cards
* Add right-turn and backward movement commands
* Connect the Arduino directly with a web-based game interface
* Add multiple game levels: easy, medium, and hard
* Add score tracking
* Add sound instructions
* Add LCD display for showing command status
* Build a physical prototype box for better presentation

---

## Technologies Used

* Arduino UNO
* MFRC522 RFID Reader
* RFID Cards
* Embedded C / Arduino C++
* Serial Communication
* Wokwi Simulation
* LEDs and Buzzer Feedback

---

## Project Status

This project is currently working as an RFID-based control system for the TangiQuest Maze Game. The Arduino reads RFID cards, identifies commands, and gives visual and audio feedback.

---

## License

This project is open-source and can be used for educational and research purposes.



---

## Author

**Kamrul Hasan**

Department of Computer Science
American International University-Bangladesh
GitHub: [kamrul-hasan007](https://github.com/kamrul-hasan007)

```
```
