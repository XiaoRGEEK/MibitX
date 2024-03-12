/*
Copyright (C): 2010-2019, Shenzhen XiaoR Tech
modified from liusen
load dependency
"MiBit": "file:../pxt-mibti"
*/

//% color="#87CEEB" weight=20 icon="\uf1b9"
namespace MiBitX {

    const MIBIT_ADDRESS = 0x0D;

    export enum IRSensor {
        //% blockId="IR1" block="IR1"
        IR1 = 0,
        //% blockId="IR2" block="IR2"
        IR2,
        //% blockId="IR3" block="IR3"
        IR3,
        //% blockId="IR4" block="IR4"
        IR4,
        //% blockId="IR5" block="IR5"
        IR5,
        //% blockId="IR6" block="IR6"
        IR6
    }
    export enum enIR {
        //% blockId="Detected" block="Detected"
        Detected = 0,
        //% blockId="NotDetected" block="NotDetected"
        NotDetected
    }

    export enum CarDirection {
        //% blockId="Stop" block="Stop"
        Stop = 0,
        //% blockId="Forward" block="Forward"
        Forward,
        //% blockId="Backward" block="Backward"
        Backward,
        //% blockId="TurnLeft" block="TurnLeft"
        TurnLeft,
        //% blockId="TurnRight" block="TurnRight"
        TurnRight,
        //% blockId="ShiftLeft" block="ShiftLeft"
        ShiftLeft,
        //% blockId="ShiftRight" block="ShiftRight"
        ShiftRight,
    }

    export enum CarSpeed {
        //% blockId="Slow" block="Slow"
        Slow = 1,
        //% blockId="Middle" block="Middle"
        Middle,
        //% blockId="Fast" block="Fast"
        Fast
    }

    export enum MotorId {
        //% blockId="Motor1" block="Motor1"
        Motor1 = 1,
        //% blockId="Motor2" block="Motor2"
        Motor2,
        //% blockId="Motor3" block="Motor3"
        Motor3,
        //% blockId="Motor4" block="Motor4"
        Motor4,
    }

    export enum MotorDirection{
        //% blockId="Invert" block="Invert"
        Invert = 0,
        //% blockId="Forward" block="Forward"
        Forward
    }

    export enum BuzzerStatus{
        //% blockId="TurnOff" block="TurnOff"
        TurnOff=0,
        //% blockId="TurnOn" block="TurnOn"
        TurnOn = 0,
    }

    //% blockId=MiBitX_CheckIRStatus block="IR_Sensor|pin %IRSensor| |%value|obstacle"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function CheckIRStatus(pin: IRSensor, value: enIR): boolean  {
        let irPin: DigitalPin;
        switch (pin) {
            case IRSensor.IR1:
                irPin = DigitalPin.P8;
                break;
            case IRSensor.IR2:
                irPin = DigitalPin.P2;
                break;
            case IRSensor.IR3:
                irPin = DigitalPin.P13;
                break;
            case IRSensor.IR4:
                irPin = DigitalPin.P14;
                break;
            case IRSensor.IR5:
                irPin = DigitalPin.P15;
                break;
            case IRSensor.IR6:
                irPin = DigitalPin.P16;
                break;
        }
        pins.setPull(irPin, PinPullMode.PullUp);
        if (pins.digitalReadPin(irPin) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% blockId=MiBitX_GetUltrasonicDistance block="Get ultrasonic distance"
    //% color="#87CEEB"
    //% weight=100
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function GetUltrasonicDistance(): number {
        // send pulse
        let Trig = DigitalPin.P1;
        let Echo = DigitalPin.P0;
        let list:Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(Trig, PinPullMode.PullNone);
            pins.digitalWritePin(Trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(Trig, 1);
            control.waitMicros(15);
            pins.digitalWritePin(Trig, 0);

            let d = pins.pulseIn(Echo, PulseValue.High, 43200);
            list[i] = Math.floor(d / 40)
        }
        list.sort();
        let length = (list[1] + list[2] + list[3])/3;
        return  Math.floor(length);
    }

    //% blockId=MiBitX_CarControl block="CarControl direction| %driection | speed %speed"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function CarControl(direction: CarDirection, speed: CarSpeed): void  {
        let buf1 = pins.createBuffer(6);
        buf1[0] = 0xFF;
        buf1[1] = 0x00;
        buf1[2] = direction;
        buf1[3] = speed;
        buf1[4] = 0x00;
        buf1[5] = 0xFF;
        pins.i2cWriteBuffer(MIBIT_ADDRESS, buf1);
    }

    //% blockId=MiBitX_MotorControl block="MotorControl| %motor | direction| %driection | speed | %speed"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% speed.min=0 speed.max=100
    export function MotorControl(motor: MotorId, direction: MotorDirection, speed: number): void  {
        let buf1 = pins.createBuffer(6);
        buf1[0] = 0xFF;
        buf1[1] = 0x01;
        buf1[2] = motor;
        buf1[3] = direction;
        buf1[4] = speed;
        buf1[5] = 0xFF;
        pins.i2cWriteBuffer(MIBIT_ADDRESS, buf1);
    }
    
    //% blockId=MiBitX_XyzControl block="XyzControl X| %x | y| %y | z | %z"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% x.min=-100 x.max=100
    //% y.min=-100 y.max=100
    //% z.min=-100 z.max=100
    export function XyzControl(x: number, y: number, z: number): void {
        let buf1 = pins.createBuffer(6);
        buf1[0] = 0xFF;
        buf1[1] = 0x02;
        buf1[2] = x+100;
        buf1[3] = y+100;
        buf1[4] = z+100;
        buf1[5] = 0xFF;
        pins.i2cWriteBuffer(MIBIT_ADDRESS, buf1);
    }

    //% blockId=MiBitX_BuzzerControl block="%status | Buzzer"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    export function BuzzerControl(status: BuzzerStatus):void {
        let buf1 = pins.createBuffer(6);
        buf1[0] = 0xFF;
        buf1[1] = 0x03;
        buf1[2] = status;
        buf1[3] = 0x00;
        buf1[4] = 0x00;
        buf1[5] = 0xFF;
        pins.i2cWriteBuffer(MIBIT_ADDRESS, buf1);
    }

}

