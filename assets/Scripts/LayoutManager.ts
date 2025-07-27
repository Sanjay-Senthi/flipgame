import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('LayoutManager')
export class LayoutManager extends Component {
    @property(Node)
    gameManagerNode: Node = null!;

    @property(Node)
    layoutMenuNode: Node = null!;

    private gameManager: GameManager = null!;

    start() {
        this.gameManager = this.gameManagerNode.getComponent(GameManager)!;
    }

    onSelectLayout(layout: string) {
        this.layoutMenuNode.active = false; // hide menu
        this.gameManager.loadLayout(layout); // load layout
    }
}
