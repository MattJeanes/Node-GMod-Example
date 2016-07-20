module.exports = function (buf) {
    if (!Buffer.isBuffer(buf)) {
        return null
    }
    return {
        buf: buf,
        size: buf.length,
        pos: 0,
        check: function (len) {
            while (this.pos + len > this.buf.length) {
                var tempbuf = new Buffer(this.size)
                tempbuf.fill(0)
                this.buf = Buffer.concat([this.buf, tempbuf])
            }
        },
        readUTF: function () {
            var len = this.readShort()
            this.pos += len
            return buf.toString('utf8', this.pos - len, this.pos)
        },
        readUTFBytes: function (length) {
            this.pos += length
            return this.buf.toString('utf8', this.pos - length, this.pos)
        },
        readUnsignedShort: function () {
            this.pos += 2
            return buf.readUInt16LE(this.pos - 2)
        },
        readShort: function () {
            this.pos += 2
            return buf.readInt16LE(this.pos - 2)
        },
        readUnsignedByte: function () {
            this.pos += 1
            return buf.readUInt8(this.pos - 1)
        },
        readByte: function () {
            this.pos += 1
            return buf.readInt8(this.pos - 1)
        },
        readUnsignedInt: function () {
            this.pos += 4
            return buf.readUInt32LE(this.pos - 4)
        },
        readInt: function () {
            this.pos += 4
            return buf.readInt32LE(this.pos - 4)
        },
        readFloat: function () {
            this.pos += 4
            return buf.readFloatLE(this.pos - 4)
        },
        writeUnsignedInt: function (value) {
            this.check(4)
            this.buf.writeUInt32LE(value, this.pos)
            this.pos += 4
        },
        writeInt: function (value) {
            this.check(4)
            this.buf.writeInt32LE(value, this.pos)
            this.pos += 4
        },
        writeFloat: function (value) {
            this.check(4)
            this.buf.writeFloatLE(value, this.pos)
            this.pos += 4
        },
        writeUnsignedShort: function (value) {
            this.check(2)
            this.buf.writeUInt16LE(value, this.pos)
            this.pos += 2
        },
        writeShort: function (value) {
            this.check(2)
            this.buf.writeInt16LE(value, this.pos)
            this.pos += 2
        },
        writeUnsignedByte: function (value) {
            this.check(1)
            this.buf.writeUInt8(value, this.pos)
            this.pos += 1
        },
        writeByte: function (value) {
            this.check(1)
            this.buf.writeInt8(value, this.pos)
            this.pos += 1
        },
        writeBoolean: function (value) {
            this.check(1)
            value = value ? 1 : 0
            this.buf.writeInt8(value, this.pos)
            this.pos += 1
        },
        // hard limit: 32765
        writeUTF: function (str) {
            var byteLength = Buffer.byteLength(str)
            this.check(byteLength)
            this.writeShort(byteLength)
            this.buf.write(str, this.pos)
            this.pos += byteLength
        },
        writeUTFBytes: function (str) {
            var byteLength = Buffer.byteLength(str)
            this.check(byteLength)
            this.buf.write(str, this.pos)
            this.pos += byteLength
        },
        getBytesAvailable: function (buf) {
            if (buf != null) {
                return buf.length - (buf.position || 0)
            } else {
                return 0
            }
        },
        scrap: function (length) {
            var result
            if (!((buf != null) && length > 0)) {
                return null
            }
            if (length + this.pos > buf.length) {
                return null
            }
            result = new Buffer(length)
            buf.copy(result, 0, this.pos, this.pos + length)
            this.pos += length
            return result
        },
        duplicate: function (buf) {
            var n, result
            n = buf.length || 0
            if (n === 0) {
                return null
            }
            result = new Buffer(n)
            buf.copy(result, 0, 0, n)
            return result
        },
        utfStringToBuf: function (str) {
            var buf, n
            str = String(str || '')
            n = Buffer.byteLength(str, 'utf8')
            buf = new Buffer(n + 2)
            buf.writeUInt16LE(n, 0)
            buf.write(str, 2)
            return buf
        },
        isAvailableBuf: function (buf) {
            return Buffer.isBuffer(buf) && buf.length > 0
        },
    }
}