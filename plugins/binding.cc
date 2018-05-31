#include <napi.h>
#include <node.h> 

#include "utils.cc"
#include "JSPyObject.h"

Napi::Value import(const Napi::CallbackInfo& args) {
    PyThreadStateLock py_thread_lock;
    FryCatch catcher(args.Env());

    Napi::Env env = args.Env();
    Napi::HandleScope scope(env);

    if (args.Length() < 1 || !args[0].IsString()) {
        Napi::TypeError::New(env, "Exactly 1 string argument should be provided to import")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string moduleName = args[0].As<Napi::String>();
    PyObject * pyModuleName = PyString_FromString(moduleName.c_str());
    PyObject * pyModule = PyImport_Import(pyModuleName);

    Py_XDECREF(pyModuleName);
    
    return catcher.safelyExitToJS(JSPyObject::WrapPyObject(env, pyModule));
}


Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    PyInit();
    napi_add_env_cleanup_hook(env, PyExit, NULL);

    JSPyObject::Initialize(env, exports);
    exports.Set("import", Napi::Function::New(env, import));
    return exports;
}

NODE_API_MODULE(binding, InitAll)