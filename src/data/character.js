// data
import descriptions from "./descriptions";
// utils
import rand from "../utils/rand";

// the maximum level a D&D character can be
const MAX_LEVEL = 20;

/** class representing a simplified D&D 5e character */
class Character {
  // a data structure storing this object's potential error messages
  errors = {
    MAX_LEVEL: `ERROR. Max Character level is 20.
Level set to:`,
  };

  // a string to hold the id generated by firebase's push() method
  firebaseID = "";

  /**
   * create a Character
   *
   * NOTE:
   * rather than taking params directly, this constructor takes a characterInfo object:
   *
   * {
   *   name: string,
   *   level: number,
   *   dndclass: string,
   *   race: string,
   *   background: string,
   * }
   *
   * This cleans up the constructor call syntax (labelling each arg and
   * allowing them to fall in whatever order), and provides a JSON-compatible
   * Character instance representation, mainly for the benefit of Firebase's
   * Real-Time Database (which stores objects in JSON).
   *
   * @param {object} characterInfo an object containing the specified properties
   *  @property {string} name a name for this character
   *  @property {number} level a starting level (no more than MAX_LEVEL)
   *  @property {string} dndclass a D&D class (e.g. "wizard")
   *  @property {string} race a D&D race (e.g. "halfling")
   *  @property {string} background a D&D background (e.g. "soldier")
   *  @property {Date} timestamp this character's time of creation
   */
  constructor({
    name,
    dndclass,
    race,
    background,
    level,
    timestamp,
  }) {
    if (!level) {
      level = 1;
    }

    this.name = name;
    this.race = {
      name: race,
      desc: descriptions.race[race],
    };
    this.dndclass = {
      name: dndclass,
      desc: descriptions.dndclass[dndclass],
      level: level,
    };
    this.background = {
      name: background,
      desc: descriptions.background[background],
    };

    if (level > MAX_LEVEL) {
      this.dndclass.level = 1;
      console.log(this.errors.MAX_LEVEL, this.dndclass.level);
    }

    this.timestamp = new Date(timestamp);
  }

  /**
   * getter method for this character's level
   */
  get level() {
    return this.dndclass.level;
  }

  /**
   * setter method for this character's level
   * @param {number} level an integer between 1 and MAX_LEVEL (inclusive)
   * @returns true if the assignment went through, false otherwise
   */
  set level(level) {
    if (Number.isInteger(level) && level >= 1 && level <= MAX_LEVEL) {
      this.dndclass.level = level;
    } else {
      console.log(this.errors.MAX_LEVEL, this.dndclass.level);
    }
    return this.dndclass.level === level;
  }

  /**
   * @function desc
   * get a description of this part of the character
   * @param {string} attribute the key of one of this object's fields
   * @returns {string} the "desc" property of the specified field
   */
  desc(attribute) {
    return this[attribute].desc;
  }

  /**
   * @function toJSON
   * converts a Character object into a JSON-compatible characterInfo
   * object
   * @returns {object} a characterInfo object representing this Character
   * object
   */
  toJSON() {
    return {
      name: this.name,
      race: this.race.name,
      dndclass: this.dndclass.name,
      background: this.background.name,
      level: this.dndclass.level,
    };
  }

  /**
   * @function compareTimestamps
   * @param {Character} a a Character instance
   * @param {Character} b another Character instance
   * @returns {number} the difference in timestamps. A positive number means character "A" was created before character "B"
   */
  static compareTimestamps = (a, b) => b.timestamp - a.timestamp;
}

const names = ["Orville", "Jennine", "Cindi", "Kori", "Mari", "Gary"];

const randomCharacterInfo = (name = "") => ({
  name: name ? name : rand(...names),
  level: Math.ceil(Math.random() * MAX_LEVEL),
  dndclass: rand(...Object.keys(descriptions.dndclass)),
  race: rand(...Object.keys(descriptions.race)),
  background: rand(...Object.keys(descriptions.background)),
  timestamp: (new Date()).toJSON(),
});

export default Character;
export { MAX_LEVEL, randomCharacterInfo };
