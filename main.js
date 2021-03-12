"use strict";

// canvas setup
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function Clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// consts

const NEIGHBORS_DISTANCE = 100;

// Common fucntions

function Dist(x0, y0, x1, y1) {
    return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
}

// Classes

class Vector {
    constructor(angle, magnitude) {
        this.x = Math.cos(angle) * magnitude;
        this.y = Math.sin(angle) * magnitude;
    }

    Add(vector) {
        if (typeof vector === "object") {
            this.x += vector.x;
            this.y += vector.y;
        } else if (typeof vector === "number") {
            this.x += vector;
            this.y += vector;
        }
    }

    Sub(vector) {
        if (typeof vector === "object") {
            this.x -= vector.x;
            this.y -= vector.y;
        } else if (typeof vector === "number") {
            this.x -= vector;
            this.y -= vector;
        }
    }

    Mlt(vector) {
        if (typeof vector === "object") {
            this.x *= vector.x;
            this.y *= vector.y;
        } else if (typeof vector === "number") {
            this.x *= vector;
            this.y *= vector;
        }
    }

    Div(vector) {
        if (typeof vector === "object") {
            this.x /= vector.x;
            this.y /= vector.y;
        } else if (typeof vector === "number") {
            this.x /= vector;
            this.y /= vector;
        }
    }
}

class Point {
    constructor(x, y, velocity) {
        this.position = { x, y };
        this.velocity = velocity;
        this.acceleration = new Vector(0, 0);
        this.maxVelocity = 1;
        points.push(this);
    }

    Update() {
        this.acceleration = new Vector(0, 0);
        this.Neighbors();
        this.RunAway();
        this.Overflow();

        this.velocity.Add(this.acceleration);
        this.position.x +=
            this.velocity.x > this.maxVelocity
                ? this.maxVelocity
                : this.velocity.x;
        this.position.y +=
            this.velocity.y > this.maxVelocity
                ? this.maxVelocity
                : this.velocity.y;
    }

    Neighbors() {
        this.neighbors = [];
        for (let point of points) {
            if (
                Dist(
                    this.position.x,
                    this.position.y,
                    point.position.x,
                    point.position.y
                ) < NEIGHBORS_DISTANCE &&
                this.position.x !== point.position.x &&
                this.position.y !== point.position.y
            ) {
                this.neighbors.push(point);
            }
        }
    }

    RunAway() {
        for (let neigh of this.neighbors) {
            let d = Dist(
                neigh.position.x,
                neigh.position.y,
                this.position.x,
                this.position.y
            );
            let diff = new Vector(0, 0);
            diff.x = (this.position.x - neigh.position.x) / d;
            diff.y = (this.position.y - neigh.position.y) / d;
            this.acceleration.Add(diff);
        }
        if (this.neighbors.length > 0) {
            this.acceleration.Div(this.neighbors.length * 100);
        }
    }

    Overflow() {
        if (this.position.x < -10) {
            this.position.x = canvas.width + 10;
        } else if (this.position.x > canvas.width + 10) {
            this.position.x = -10;
        }
        if (this.position.y < -10) {
            this.position.y = canvas.height + 10;
        } else if (this.position.y > canvas.height + 10) {
            this.position.y = -10;
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.ellipse(
            this.position.x,
            this.position.y,
            10,
            10,
            0,
            0,
            2 * Math.PI
        );
        ctx.fill();

        for (let neigh of this.neighbors) {
            if (
                Dist(
                    this.position.x,
                    this.position.y,
                    neigh.position.x,
                    neigh.position.y
                ) < NEIGHBORS_DISTANCE
            ) {
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(neigh.position.x, neigh.position.y);
                ctx.stroke();
            }
        }
    }
}

let points = [];

for (let i = 0; i < 200; i++) {
    new Point(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        new Vector(Math.random() * 2 * Math.PI, 0.5)
    );
}

function Run() {
    setInterval(() => {
        Clear();
        for (let point of points) {
            point.Update();
            point.Draw();
        }
    }, 1);
}

Run();
