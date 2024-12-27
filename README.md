# Draw-foodweb
This app is written in JavaScript and it allows students to construct ecological food web which can be checked against a set of pre-defined answers. 

## Features
- Drag positioning of organisms with relationships retained
- Draw arrows to show feeding relationships with auto-snap to organisms
- Deletion of arrows
- Scoring of constructed food web against answers

## Installation
Include [Konva JavaScript library](https://konvajs.org/) which provides the interactivity for the canvas. 

## Usage
Pre-defined answers (correct node links) have to be provided as an array of objects in script.js file.

### Scoring
- 1 point for every correct feeding relationship (arrow drawn)
- -1 point for every incorrect feeding relationship (arrow drawn)
- No deduction of points for missing relationships

## License
This project is proprietary and may not be used, copied, modified, or distributed without explicit written permission from the copyright holder. All rights reserved.


