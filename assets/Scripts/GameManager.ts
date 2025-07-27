import {
    _decorator,
    Component,
    Node,
    Prefab,
    instantiate,
    Label,
    AudioSource,
    SpriteFrame,
} from 'cc';
import { Card } from './Card';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    cardPrefab: Prefab = null!;

    @property(Node)
    cardContainer: Node = null!;

    @property(Label)
    gameOverLabel: Label = null!;

    @property([SpriteFrame])
    emojiSprites: SpriteFrame[] = [];

    @property(AudioSource)
    audioFlip: AudioSource = null!;

    @property(AudioSource)
    audioMatch: AudioSource = null!;

    @property(AudioSource)
    audioMismatch: AudioSource = null!;

    private flippedCards: Card[] = [];
    private allCards: Card[] = [];

    loadLayout(layout: string) {
        // Clear previous cards
        this.cardContainer.removeAllChildren();
        this.flippedCards = [];
        this.allCards = [];
        this.gameOverLabel.node.active = false;

        // Decide how many pairs
        let totalCards = layout === '2x2' ? 4 :
                         layout === '2x3' ? 6 :
                         layout === '5x6' ? 30 : 4;

        let totalPairs = totalCards / 2;

        // Randomize and duplicate emojis
        let selectedSprites = [...this.emojiSprites]
            .sort(() => Math.random() - 0.5)
            .slice(0, totalPairs);

        let cardData = [...selectedSprites, ...selectedSprites].sort(() => Math.random() - 0.5);

        // Create cards
        for (let i = 0; i < totalCards; i++) {
            const cardNode = instantiate(this.cardPrefab);
            const card = cardNode.getComponent(Card)!;

            card.cardId = cardData[i].name;
            card.setFrontSprite(cardData[i]);

            cardNode.on(Node.EventType.TOUCH_END, () => this.onCardClicked(card), this);
            this.cardContainer.addChild(cardNode);
            this.allCards.push(card);
        }
    }

    onCardClicked(card: Card) {
        if (this.flippedCards.length >= 2 || card.isFlipped || card.isMatched) return;

        this.audioFlip.play();
        card.flip(() => {
            this.flippedCards.push(card);
            if (this.flippedCards.length === 2) {
                this.checkMatch();
            }
        });
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.cardId === card2.cardId) {
            this.audioMatch.play();
            card1.isMatched = true;
            card2.isMatched = true;
            this.flippedCards = [];

            if (this.allCards.every(c => c.isMatched)) {
                this.gameOverLabel.string = "🎉 You Win!";
                this.gameOverLabel.node.active = true;
            }
        } else {
            this.audioMismatch.play();
            setTimeout(() => {
                card1.flipBack();
                card2.flipBack();
                this.flippedCards = [];
            }, 800);
        }
    }
}
