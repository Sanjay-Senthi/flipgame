import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    @property(Node)
    frontFace: Node = null!;

    @property(Node)
    backFace: Node = null!;

    private frontSprite!: Sprite;

    cardId: string = '';
    isFlipped: boolean = false;
    isMatched: boolean = false;

    onLoad() {
        // Cache the Sprite component from frontFace
        this.frontSprite = this.frontFace.getComponent(Sprite)!;

        // Start with front hidden and back shown
        this.frontFace.active = false;
        this.backFace.active = true;
    }

    /**
     * Sets the emoji/image sprite on the front face
     */
    setFrontSprite(sprite: SpriteFrame) {
        this.frontSprite.spriteFrame = sprite;
    }

    /**
     * Flip the card (show front face)
     */
    flip(callback?: () => void) {
        if (this.isFlipped || this.isMatched) return;

        this.isFlipped = true;

        tween(this.node)
            .to(0.15, { scale: new Vec3(0, 1, 1) })
            .call(() => {
                this.frontFace.active = true;
                this.backFace.active = false;
            })
            .to(0.15, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }

    /**
     * Flip the card back (show back face)
     */
    flipBack() {
        this.isFlipped = false;

        tween(this.node)
            .to(0.15, { scale: new Vec3(0, 1, 1) })
            .call(() => {
                this.frontFace.active = false;
                this.backFace.active = true;
            })
            .to(0.15, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    /**
     * Mark this card as matched (so it won't flip again)
     */
    setMatched() {
        this.isMatched = true;
    }
}
