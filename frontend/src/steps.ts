import type { ERC20 } from "./utils/contracts";

import Approve from "./steps/Approve.svelte";
import Swap from "./steps/Swap.svelte";

export class StepManager {
    private steps: Step[];
    private currentStepIndex: number;
    private onStepChangedCallback?: (step: Step) => void;


    public constructor() {
        this.steps = [];
        this.currentStepIndex = 0;
        this.onStepChangedCallback = undefined;
    }

    public addStep(step: Step): void {
        this.steps.push(step);
    }

    public init() {
        let currentStep = this.steps[this.currentStepIndex];
        this.onStepChangedCallback!(currentStep);
    }

    public onStepChanged(callback: (step: Step) => void): any {
        this.onStepChangedCallback = callback;
    }
}

export abstract class Step {
    public abstract getComponent(): any;

    public abstract canBeSkipped(): boolean;
}

export class ApproveStep extends Step {

    private lgo: ERC20;

    public constructor(lgo: ERC20) {
        super();
        this.lgo = lgo;
    }

    public getComponent() {
        return Approve;
    }

    public canBeSkipped(): boolean {
        return false;
    }
}

export class AWaitForApprovalConfirmationStep {

}

export class SwapStep extends Step {
    public getComponent() {
        return Swap;
    }

    public canBeSkipped(): boolean {
        return false;
    }
}