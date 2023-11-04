export class Field {
    constructor(id, name, icon, description) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = description;
    }

    serialize() {
        return {
            "id": this.id,
            "name": this.name,
            "icon": this.icon,
            "description": this.description
        };
    }
}
