---
title: "Gameboy Emulator Part 1"
date: 2026-01-07
draft: false
---


I was quite bored one day, with not much on my plate, I decided to create a GameBoy emulator.
How hard can it be, after all it's most CS students first real C project (or an emulator of some kind)
Alright so where do I start.

## Memory

Different sources can refer to memory regions differently. High RAM is sometimes called Zero Page Memory, Cartridge Data is sometimes just called ROM, and if a document just says RAM, it is usually refering to the Working RAM. Being aware of this is essential when reading through documents written by different people.

## Registers

The Game Boy has eight 8 bit registers: A, B, C, D, E, F, H, and L, as well as two 16 bit registers: SP, and PC. Initially I implemented the registers like so:

```c
struct registers {
	unsigned char a;
	unsigned char b;
	unsigned char c;
	unsigned char d;
	unsigned char e;
	unsigned char h;
	unsigned char l;
	unsigned char flags;
	unsigned short sp;
	unsigned short pc;
} extern registers;
```

While this model is fine for dealing with instructions that access the 8 bit registers individually, what I didn't realise is that often the 8 bit registers are grouped together to form the 16 bit registers: AF, BC, DE, and HL.

I revised my register structure to make accessing grouped registers easier:

```c
struct registers {
	struct {
		union {
			struct {
				unsigned char f;
				unsigned char a;
			};
			unsigned short af;
		};
	};

	struct {
		union {
			struct {
				unsigned char c;
				unsigned char b;
			};
			unsigned short bc;
		};
	};
	
	struct {
		union {
			struct {
				unsigned char e;
				unsigned char d;
			};
			unsigned short de;
		};
	};
	
	struct {
		union {
			struct {
				unsigned char l;
				unsigned char h;
			};
			unsigned short hl;
		};
	};
	
	unsigned short sp;
	unsigned short pc;
} extern registers;
```

using C11's anonymous structs allows me to do `registers.a` or `registers.af` for example.

## Flags

The Game Boy has an 8 bit register which controls if the last operation resulted in zero, an underflow, a nibble overflow, or a byte overflow; refered to as the zero flag, the negative flag, the half carry flag, and the full carry flag, respectively.

One thing that initially tripped me up, is that I wasn't sure if I should update the flags after every instruction, or after just some, and if so, which ones (and how should I store this information). I eventually came across [this great piece of documentation](http://gameboy.mongenel.com/dmg/opcodes.html) which describes in detail which instructions should update the flags, and to what values.


## Implementing the CPU

I went with the classic `switch(instruction)` approach, in which all instructions are placed in the same function.

Whenever an unimplemented instruction was encountered, the register values were printed and halted the program.

I chose to use the game [Tetris](http://en.wikipedia.org/wiki/Tetris_%28Game_Boy%29) for testing. Upon running it, I got a message telling me "Undefined instruction 0x00!".

To confirm that this was right, I ran the game in [NO$GMB](http://problemkaputt.de/gmb.htm), which has an excellent debugger. Sure enough, the first instruction of Tetris is 0x00, which is a [NOP](http://en.wikipedia.org/wiki/NOP).

I implemented the NOP instruction, and ran the game again to get the next, unsupported instruction. I continued with this method for a few more instructions, checking each time that the register values displayed by my emulator matched those in NO$GMB.


## Improving instruction handling

For now I'll keep this style of instruction but I plan on making much simpler with structs

```c
// decrement

case 0x05: dec_v_ptr(&registers.b); return 0; // DEC B
case 0x15: dec_v_ptr(&registers.d); return 0; // DEC D
case 0x25: dec_v_ptr(&registers.h); return 0; // DEC H
case 0x35: dec_mem_hl();            return 0; // DEC(HL)
case 0x0D: dec_v_ptr(&registers.c); return 0; // DEC C
case 0x1D: dec_v_ptr(&registers.e); return 0; // DEC E
case 0x2D: dec_v_ptr(&registers.l); return 0; // DEC L
case 0x3D: dec_v_ptr(&registers.a); return 0;
```

I plan on creating a system like this

```c
struct instruction {
	char *disassembly;
	unsigned char operandLength;
	void *execute;
	//unsigned char ticks;
} extern const instructions[256];
```


But for now brute force will be fine. I added 71 OP codes before finally the game stop spitting me out. 

## Tilesets

For now tilesets have been kicking my ass. I can't seem to get vulkan and my code to work. My current setup I think certain opcodes aren't working and I'll need to reopen the project with a clear mind.



